"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PageLoader } from "@/components/shared/LoadingSpinner";
import { Loader2, Save, User, MapPin, Link, Linkedin, Camera, CheckCircle2 } from "lucide-react";
import { getInitials } from "@/lib/utils/formatters";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, token, refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    location: "",
    linkedinUrl: "",
    portfolioUrl: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        bio: user.bio || "",
        location: user.location || "",
        linkedinUrl: user.linkedinUrl || "",
        portfolioUrl: user.portfolioUrl || "",
      });
      setIsLoading(false);
    }
  }, [user]);

  const handleChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      await refreshUser();
      setSaved(true);
      toast.success("Profile updated successfully!");
      setTimeout(() => setSaved(false), 3000);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <PageLoader label="Loading profile…" />;

  const initials = getInitials(formData.firstName, formData.lastName);
  const completionFields = [
    !!formData.firstName && !!formData.lastName,
    !!formData.bio,
    !!formData.location,
    !!formData.linkedinUrl,
    !!formData.portfolioUrl,
  ];
  const completionPct = Math.round((completionFields.filter(Boolean).length / completionFields.length) * 100);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-display font-bold">Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your professional information</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left - Avatar & Completion */}
        <div className="space-y-4">
          {/* Avatar */}
          <div className="bg-background border border-border rounded-xl p-6 text-center">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center text-white text-2xl font-bold font-display mx-auto">
                {user?.profilePhoto ? (
                  <img src={user.profilePhoto} alt="" className="w-full h-full rounded-full object-cover" />
                ) : (
                  initials
                )}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-background border border-border rounded-full flex items-center justify-center hover:bg-muted transition-colors shadow-sm">
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            <h2 className="font-semibold">{formData.firstName} {formData.lastName}</h2>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <Badge variant="secondary" className="mt-2">{user?.subscriptionTier} plan</Badge>
          </div>

          {/* Profile Completion */}
          <div className="bg-background border border-border rounded-xl p-5">
            <h3 className="font-semibold text-sm mb-3">Profile Completion</h3>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 bg-muted rounded-full h-2">
                <div
                  className="bg-violet-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-violet-600">{completionPct}%</span>
            </div>
            <ul className="space-y-1.5">
              {[
                { label: "Name", done: !!formData.firstName && !!formData.lastName },
                { label: "Bio", done: !!formData.bio },
                { label: "Location", done: !!formData.location },
                { label: "LinkedIn URL", done: !!formData.linkedinUrl },
                { label: "Portfolio URL", done: !!formData.portfolioUrl },
              ].map(({ label, done }) => (
                <li key={label} className={`flex items-center gap-2 text-xs ${done ? "text-emerald-600" : "text-muted-foreground"}`}>
                  <CheckCircle2 className={`w-3.5 h-3.5 ${!done && "opacity-30"}`} />
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right - Form */}
        <div className="lg:col-span-2 bg-background border border-border rounded-xl p-6 space-y-5">
          <h2 className="font-semibold flex items-center gap-2">
            <User className="w-4 h-4 text-violet-600" />
            Personal Information
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" value={formData.firstName} onChange={handleChange("firstName")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" value={formData.lastName} onChange={handleChange("lastName")} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bio">Professional Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself, your expertise, and career goals..."
              value={formData.bio}
              onChange={handleChange("bio")}
              rows={4}
              maxLength={500}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground text-right">{formData.bio.length}/500</p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="location" className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />Location
            </Label>
            <Input id="location" placeholder="City, Country" value={formData.location} onChange={handleChange("location")} />
          </div>

          <Separator />

          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Link className="w-4 h-4 text-muted-foreground" />Online Presence
          </h3>

          <div className="space-y-1.5">
            <Label htmlFor="linkedin" className="flex items-center gap-1.5">
              <Linkedin className="w-3.5 h-3.5 text-blue-600" />LinkedIn URL
            </Label>
            <Input
              id="linkedin"
              placeholder="https://linkedin.com/in/yourname"
              value={formData.linkedinUrl}
              onChange={handleChange("linkedinUrl")}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="portfolio">Portfolio / Website</Label>
            <Input
              id="portfolio"
              placeholder="https://yourportfolio.com"
              value={formData.portfolioUrl}
              onChange={handleChange("portfolioUrl")}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className={`gap-2 ${saved ? "bg-emerald-600 hover:bg-emerald-700" : "bg-violet-600 hover:bg-violet-700"} text-white`}
            >
              {isSaving ? (
                <><Loader2 className="w-4 h-4 animate-spin" />Saving…</>
              ) : saved ? (
                <><CheckCircle2 className="w-4 h-4" />Saved!</>
              ) : (
                <><Save className="w-4 h-4" />Save Changes</>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
