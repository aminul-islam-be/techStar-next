import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_PROFILE_UPLOAD_PRESET ||
  "techstar_profiles";
const STUDY = ["School", "College", "University", "Madrasha"];
export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    profilePicture: "",
    permanentAddress: "",
    city: "",
    postalCode: "",
    country: "Bangladesh",
    office: "",
    study: "",
    institutionName: "",
  });
  const [loading, setLoading] = useState(true),
    [saving, setSaving] = useState(false),
    [uploading, setUploading] = useState(false),
    [message, setMessage] = useState(""),
    [error, setError] = useState("");
  useEffect(() => {
    if (status === "unauthenticated") router.replace("/auth/login");
    if (status === "authenticated") load();
  }, [status]);
  async function load() {
    try {
      const r = await fetch("/api/profile");
      const d = await r.json();
      if (!r.ok) throw new Error(d.message);
      setForm((f) => ({
        ...f,
        ...d.profile,
        email: d.profile.email || "",
        profilePicture: d.profile.profilePicture || "",
        study: d.profile.study || "",
        institutionName: d.profile.institutionName || "",
      }));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  async function upload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!CLOUD) {
      setError("Cloudinary cloud name is not configured");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", PRESET);
      const r = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`,
        { method: "POST", body: fd }
      );
      const d = await r.json();
      if (!r.ok || !d.secure_url)
        throw new Error(d.error?.message || "Profile image upload failed");
      setForm((f) => ({ ...f, profilePicture: d.secure_url }));
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  }
  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const r = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.message);
      setForm((f) => ({ ...f, ...d.profile }));
      setMessage("Profile saved. Future Checkout will use these defaults.");
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }
  if (status === "loading" || loading)
    return <div className="loading">Loading profile...</div>;
  return (
    <> <Head> <title>My Profile - TechStar</title> </Head> <div className="page"> <div className="card"> <Link href="/" className="back"> ← Back to Home </Link> <h1>My Profile</h1> <p className="hint"> Saved profile details become the default values on Checkout. </p> {error && <div className="error">{error}</div>} {message && <div className="success">{message}</div>} <form onSubmit={save}> <div className="avatarWrap"> {form.profilePicture ? ( <img src={form.profilePicture} className="avatar" alt="Profile" /> ) : ( <div className="avatar placeholder">👤</div> )} <label className="upload"> {uploading ? "Uploading..." : "Change Profile Picture"} <input type="file" accept="image/*" onChange={upload} disabled={uploading} /> </label> </div> <div className="grid"> <Field label="Full Name" name="name" value={form.name} onChange={change} required /> <Field label="Phone Number" name="phone" value={form.phone} onChange={change} required type="tel" /> <Field label="Email Address" name="email" value={form.email} onChange={change} type="email" /> <Field label="Permanent Address" name="permanentAddress" value={form.permanentAddress} onChange={change} wide /> <Field label="City" name="city" value={form.city} onChange={change} /> <Field label="Postal Code" name="postalCode" value={form.postalCode} onChange={change} /> <Field label="Country" name="country" value={form.country} onChange={change} /> <Field label="Office" name="office" value={form.office} onChange={change} wide /> <div className="field"> <label>Study</label> <select name="study" value={form.study} onChange={change}> <option value="">Select if applicable</option> {STUDY.map((x) => ( <option key={x}>{x}</option> ))} </select> </div> {form.study && ( <Field label={`${form.study} Name`} name="institutionName" value={form.institutionName} onChange={change} placeholder={`Enter your ${form.study.toLowerCase()} name`} wide /> )} </div> <button className="save" disabled={saving || uploading}> {saving ? "Saving..." : "Save Profile"} </button> </form> <button className="logout" onClick={() => signOut({ callbackUrl: "/auth/register" })} > Logout </button> </div> </div> <style jsx>{` .page { min-height: 100vh; background: #f0f2f5; padding: 30px 16px; } .card { max-width: 760px; margin: auto; background: #fff; padding: 32px; border-radius: 16px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08); } h1 { margin: 8px 0; color: #333; } .hint { color: #666; } .back { color: #667eea; text-decoration: none; } .error, .success { padding: 12px; border-radius: 8px; margin: 14px 0; } .error { background: #fee; color: #c00; } .success { background: #efe; color: #075; } .avatarWrap { text-align: center; margin: 20px 0; } .avatar { width: 110px; height: 110px; border-radius: 50%; object-fit: cover; border: 4px solid #eee; } .placeholder { display: inline-flex; align-items: center; justify-content: center; background: #667eea; color: #fff; font-size: 50px; } .upload { display: block; color: #667eea; font-weight: 600; margin-top: 10px; cursor: pointer; } .upload input { display: none; } .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; } .field { display: flex; flex-direction: column; gap: 6px; } .field.wide { grid-column: 1/-1; } .field label { font-weight: 600; font-size: 14px; color: #333; } .field input, .field select { padding: 11px 13px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 15px; box-sizing: border-box; } .field input:focus, .field select:focus { outline: none; border-color: #667eea; } .save, .logout { width: 100%; padding: 12px; border: 0; border-radius: 8px; font-weight: 700; cursor: pointer; margin-top: 22px; } .save { background: linear-gradient(135deg, #667eea, #764ba2); color: #fff; } .logout { background: #e74c3c; color: #fff; } .save:disabled { opacity: 0.6; } .loading { min-height: 100vh; display: grid; place-items: center; } @media (max-width: 650px) { .grid { grid-template-columns: 1fr; } .field.wide { grid-column: auto; } .card { padding: 22px 16px; } } `}</style> </>
  );
}
function Field({ label, name, value, onChange, type = "text", required = false, wide = false, placeholder = "", }) {
  return (
    <div className={`field ${wide ? "wide" : ""}`}> <label> {label} {required ? " *" : ""} </label> <input type={type} name={name} value={value || ""} onChange={onChange} required={required} placeholder={placeholder} /> </div>
  );
    }
