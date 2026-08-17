"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfileEditor({
  username,
  initialName,
  initialImage,
}: {
  username: string;
  initialName: string;
  initialImage: string;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(initialName);
  const [image, setImage] = useState(initialImage);
  const [saving, setSaving] = useState(false);

  if (!editing) {
    return (
      <button onClick={() => setEditing(true)} className="btn-secondary text-sm">
        Edit profile
      </button>
    );
  }

  async function save() {
    setSaving(true);
    await fetch(`/api/users/${username}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, image }),
    });
    setSaving(false);
    setEditing(false);
    router.refresh();
  }

  return (
    <div className="card p-4 space-y-3 mt-4 max-w-sm">
      <input value={name} onChange={(e) => setName(e.target.value)} className="input" placeholder="Name" />
      <input
        value={image}
        onChange={(e) => setImage(e.target.value)}
        className="input"
        placeholder="Photo URL"
      />
      <div className="flex gap-2">
        <button onClick={save} disabled={saving} className="btn-primary flex-1 disabled:opacity-50">
          {saving ? "Saving…" : "Save"}
        </button>
        <button onClick={() => setEditing(false)} className="btn-secondary flex-1">
          Cancel
        </button>
      </div>
    </div>
  );
}
