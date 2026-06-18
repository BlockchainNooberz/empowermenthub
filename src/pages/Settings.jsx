import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle, ChevronRight, User, LogOut } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";

export default function Settings() {
  const { user } = useAuth();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const handleDeleteAccount = async () => {
    if (confirmText !== "DELETE") return;
    setDeleting(true);
    try {
      // Delete the user's own record — platform handles session invalidation
      await base44.entities.User.delete(user.id);
      base44.auth.logout("/login");
    } catch {
      setDeleting(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <PageHeader title="Settings" subtitle="Manage your account and preferences" />

      {/* Profile section */}
      <div className="bg-card border border-border rounded-xl p-5 mb-5">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
            {user?.full_name?.charAt(0) || "U"}
          </div>
          <div>
            <p className="font-semibold text-foreground">{user?.full_name || "User"}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <div className="pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-1">Role</p>
          <span className="text-sm capitalize bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
            {user?.role || "user"}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-card border border-border rounded-xl overflow-hidden mb-5">
        <button
          onClick={() => base44.auth.logout()}
          className="flex items-center justify-between w-full px-5 py-4 hover:bg-muted/50 transition-colors select-none"
        >
          <div className="flex items-center gap-3 text-foreground">
            <LogOut className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium">Sign Out</span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Danger zone */}
      <div className="bg-destructive/5 border border-destructive/20 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-destructive/20">
          <p className="text-xs font-bold uppercase tracking-widest text-destructive">Danger Zone</p>
        </div>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="flex items-center justify-between w-full px-5 py-4 hover:bg-destructive/10 transition-colors select-none"
        >
          <div className="flex items-center gap-3 text-destructive">
            <Trash2 className="w-5 h-5" />
            <span className="font-medium">Delete Account</span>
          </div>
          <ChevronRight className="w-4 h-4 text-destructive/60" />
        </button>
      </div>

      {/* Delete confirmation dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/50">
          <div
            className="bg-card rounded-2xl w-full max-w-md p-6 space-y-4"
            style={{ marginBottom: "env(safe-area-inset-bottom)" }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-foreground">Delete Account</h3>
                <p className="text-xs text-muted-foreground">This action cannot be undone</p>
              </div>
            </div>
            <ul className="text-sm text-muted-foreground space-y-1 pl-2">
              <li>• All your loan requests will be deleted</li>
              <li>• Your supply chain products will be removed</li>
              <li>• Your skill credentials will be erased</li>
              <li>• Your education resources will be deleted</li>
              <li>• You will be immediately signed out</li>
            </ul>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Type DELETE to confirm
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={e => setConfirmText(e.target.value)}
                placeholder="DELETE"
                className="mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-destructive"
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 select-none"
                onClick={() => { setShowDeleteConfirm(false); setConfirmText(""); }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground select-none"
                disabled={confirmText !== "DELETE" || deleting}
                onClick={handleDeleteAccount}
              >
                {deleting ? "Deleting…" : "Delete Account"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}