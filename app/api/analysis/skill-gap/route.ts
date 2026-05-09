import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Resume from '@/lib/models/Resume';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const payload = getUserFromRequest(req);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();

    const { resumeId, targetSkills } = await req.json();

    let resume;
    if (resumeId) {
      resume = await Resume.findOne({ _id: resumeId, userId: payload.userId });
    } else {
      resume = await Resume.findOne({ userId: payload.userId, isPrimary: true });
    }

    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    const userSkills = resume.extractedData?.skills || [];
    const userSkillNames = userSkills.map((s: { name: string }) => s.name.toLowerCase());

    // Analyze gaps
    const skillGaps = (targetSkills || []).filter(
      (skill: string) => !userSkillNames.includes(skill.toLowerCase())
    );

    // Group user skills by category
    const skillsByCategory: Record<string, unknown[]> = {};
    userSkills.forEach((skill: { category: string; name: string; proficiency: string }) => {
      if (!skillsByCategory[skill.category]) skillsByCategory[skill.category] = [];
      skillsByCategory[skill.category].push(skill);
    });

    // Generate radar chart data
    const categories = Object.keys(skillsByCategory);
    const radarData = categories.map((cat) => ({
      category: cat,
      count: (skillsByCategory[cat] as unknown[]).length,
      avgProficiency: calculateAvgProficiency(skillsByCategory[cat] as Array<{proficiency: string}>),
    }));

    return NextResponse.json({
      userSkills,
      skillsByCategory,
      radarData,
      skillGaps,
      totalSkills: userSkills.length,
      topSkills: userSkills
        .sort((a: {proficiency: string}, b: {proficiency: string}) => proficiencyScore(b.proficiency) - proficiencyScore(a.proficiency))
        .slice(0, 5),
    });
  } catch (error) {
    console.error('Skill gap error:', error);
    return NextResponse.json({ error: 'Failed to analyze skills' }, { status: 500 });
  }
}

function proficiencyScore(proficiency: string): number {
  const scores: Record<string, number> = { Beginner: 1, Intermediate: 2, Advanced: 3, Expert: 4 };
  return scores[proficiency] || 0;
}

function calculateAvgProficiency(skills: Array<{proficiency: string}>): number {
  if (!skills.length) return 0;
  const sum = skills.reduce((acc, s) => acc + proficiencyScore(s.proficiency), 0);
  return Math.round((sum / skills.length) * 25); // Convert to 0-100 scale
}
