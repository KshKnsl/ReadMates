import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import {
  Mail,
  Calendar,
  Edit,
  Save,
  Search,
  Upload,
  Github,
  Twitter,
  Linkedin,
  Instagram,
  Paperclip,
} from "lucide-react";
import { INTERESTS } from "../constants";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import { badges as badgeData } from "../constants";
import Footer from "../components/Footer";

const dummyData: UserData = {
  id: "67613652de5b440ea1d71979",
  name: "John Doe",
  email: "john.doe@example.com",
  dob: "1990-01-01",
  avatar: "https://avatar.iran.liara.run/public/boy",
  bio: "Avid reader and collaborative writer passionate about technology and science fiction.",
  socialLinks: [
    "https://twitter.com/johndoe",
    "https://linkedin.com/in/johndoe",
    "https://github.com/johndoe",
    "instagrap/iej",
  ],
  points: 100,
  badges: ["Rising Blogger", "Helper"],
  interests: ["Science Fiction", "Technology", "Writing"],
  savedArticles: ["article1", "article2"],
  contributions: [
    { articleId: "article1", points: 50 },
    { articleId: "article2", points: 30 },
  ],
};

interface UserData {
  id: string;
  name: string;
  email: string;
  dob: string;
  avatar: string;
  bio: string;
  socialLinks: string[];
  points: number;
  badges: string[];
  interests: string[];
  savedArticles: string[];
  contributions: Array<{ articleId: string; points: number }>;
}

function Profile() {
  const auth = useContext(AuthContext);
  const { id } = useParams<{ id: string }>();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const userId = id || (auth.user ? auth.user._id : null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        setUserData(data);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setUserData(dummyData);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [userId]);

  if (loading) {
    return <div className="text-center py-8 h-screen bg-amber-50 dark:bg-gray-800">Loading user data...</div>;
  }

  const user = userData || dummyData;

  const filteredInterests = INTERESTS.filter((interest) =>
    interest.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInterestToggle = (interest: string) => {
    if (user.interests.includes(interest)) {
      setUserData({
        ...user,
        interests: user.interests.filter((i) => i !== interest),
      });
    } else {
      setUserData({
        ...user,
        interests: [...user.interests, interest],
      });
    }
  };

  async function updateEditData() {
    // console.log("Updating user data with:", user);
    setEditMode(false);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/updateUser`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      if (res.ok) {
        toast.success(`Update attempt by ${user.name} was successful`);
      } else {
        throw new Error("Failed to update user data");
      }
    } catch (error) {
      toast.error(`Update Failed: ${error}`);
    }
  }

  async function avatarUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("image", file);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/${userId}/uploadAvatar`, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        setUserData({ ...user, avatar: data.newAvatar });
        toast.success("Avatar uploaded successfully");
        setFile(null);
      } else throw new Error(await response.json());
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Failed to upload avatar");
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
    }
  };
  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-800">
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex gap-4 mx-auto justify-center md:flex-row flex-col">
        <div className="max-w-3xl bg-white dark:bg-gray-700 shadow-xl rounded-2xl overflow-hidden p-6">
          <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
            <div className="md:w-48">
              <img
                className="h-48 w-48 rounded-full border-4 border-white shadow-lg object-cover"
                src={user.avatar}
                alt={`${user.name}'s avatar`}
              />
              <form
                onSubmit={avatarUpload}
                encType="multipart/form-data"
                className="mt-4 flex items-center justify-center"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-amber-300 hover:bg-amber-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-white py-2 px-4 rounded-full text-sm flex items-center"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Avatar
                </button>
                {file && (
                  <button
                    type="submit"
                    className="ml-2 bg-amber-500 hover:bg-amber-600 dark:bg-gray-600 dark:hover:bg-gray-500 text-white py-2 px-4 rounded-full text-sm"
                  >
                    Upload Avatar
                  </button>
                )}
              </form>
              {file && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 text-center">
                  Selected file: {file.name}
                </p>
              )}
            </div>
            <div className="flex flex-col">
              <div className="flex flex-col space-y-2">
                {!editMode ? (
                  <>
                    <h2 className="text-3xl font-bold text-amber-900 dark:text-amber-300">
                      {user.name}
                    </h2>
                    <p className="text-amber-700 dark:text-amber-300 italic text-lg">{user.bio}</p>
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      className="w-full text-2xl font-bold text-amber-900 dark:text-amber-300 p-2 rounded-md border border-amber-300 dark:border-gray-600 focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-800"
                      value={user.name}
                      onChange={(e) =>
                        setUserData({ ...user, name: e.target.value })
                      }
                    />
                    <textarea
                      className="w-full mt-2 text-amber-700 dark:text-amber-300 italic p-2 rounded-md border border-amber-300 dark:border-gray-600 focus:ring-2 focus:ring-amber-500 focus:border-transparent  dark:bg-gray-800"
                      value={user.bio}
                      onChange={(e) =>
                        setUserData({ ...user, bio: e.target.value })
                      }
                      rows={3}
                    />
                  </>
                )}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {user.badges.map((badge, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-amber-100 dark:bg-gray-700 text-amber-800 dark:text-amber-300 text-xs font-semibold rounded-full"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 dark:border-gray-600 pt-6">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-300 flex items-center">
                  <Mail className="w-5 h-5 mr-2 text-amber-600 dark:text-amber-300" />
                  Email
                </div>
                <div className="mt-1 text-sm text-gray-900 dark:text-gray-300">{user.email}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-300 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-amber-600 dark:text-amber-300" />
                  Date of Birth
                </div>
                <div className="mt-1 text-sm text-gray-900 dark:text-gray-300">
                  {!editMode ? (
                    isNaN(new Date(user.dob).getTime()) ? (
                      "N/A"
                    ) : (
                      new Date(user.dob).toLocaleDateString()
                    )
                  ) : (
                    <input
                      type="date"
                      className="w-full p-2 rounded-md border border-amber-300 dark:border-gray-600 focus:ring-2 focus:ring-amber-500 focus:border-transparent  dark:bg-gray-800"
                      value={user.dob}
                      onChange={(e) =>
                        setUserData({ ...user, dob: e.target.value })
                      }
                    />
                  )}
                </div>
              </div>
            </dl>
          </div>
          <div className="mt-8">
            <h3 className="text-lg leading-6 font-medium text-amber-900 dark:text-amber-300">
              User Statistics
            </h3>
            <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-700 overflow-hidden shadow rounded-lg p-4">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-300 truncate">
                  Total Points
                </div>
                <div className="mt-1 text-3xl font-semibold text-amber-900 dark:text-amber-300">
                  {user.points}
                </div>
              </div>
              <div className="bg-white dark:bg-gray-700 overflow-hidden shadow rounded-lg p-4">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-300 truncate">
                  Contributions
                </div>
                <div className="mt-1 text-3xl font-semibold text-amber-900 dark:text-amber-300">
                  {user.contributions.length}
                </div>
              </div>
              <div className="bg-white dark:bg-gray-700 overflow-hidden shadow rounded-lg p-4">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-300 truncate">
                  Saved Articles
                </div>
                <div className="mt-1 text-3xl font-semibold text-amber-900 dark:text-amber-300">
                  {user.savedArticles.length}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <h3 className="text-lg leading-6 font-medium text-amber-900 dark:text-amber-300">
              Interests
            </h3>
            {editMode && (
              <div className="mt-2 relative">
                <input
                  type="text"
                  className="w-full p-2 pl-10 rounded-md border border-amber-300 dark:border-gray-600 focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-800"
                  placeholder="Search interests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-300" />
              </div>
            )}
            <div className="mt-2 flex flex-wrap gap-2 max-h-48 overflow-y-scroll scrollbar-hidden">
              {(editMode ? filteredInterests : user.interests).map((interest) => (
                <button
                  key={interest}
                  onClick={() => editMode && handleInterestToggle(interest)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user.interests.includes(interest)
                      ? "bg-amber-100 dark:bg-gray-700 text-amber-800 dark:text-amber-300 border-2 border-amber-500 dark:border-amber-300"
                      : "bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-500"
                  } ${editMode ? "cursor-pointer" : "cursor-default"}`}
                  disabled={!editMode}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-8">
            <h3 className="text-lg leading-6 font-medium text-amber-900 dark:text-amber-300">
              Social Links
            </h3>
            <div className="ml-4 mt-2 flex flex-col items-start gap-2">
              {user.socialLinks.map((url, index) => (
                <div
                  key={index}
                  className="flex gap-2 items-center hover:text-amber-800 dark:hover:text-amber-300 dark:text-gray-200"
                >
                  {url.includes("github") && <Github />}
                  {url.includes("twitter") && <Twitter />}
                  {url.includes("linkedin") && <Linkedin />}
                  {url.includes("insta") && <Instagram />}
                  {!url.includes("github") &&
                    !url.includes("twitter") &&
                    !url.includes("linkedin") &&
                    !url.includes("insta") && <Paperclip />}
                  {!editMode ? (
                    <a href={url} target="_blank">
                      {url}
                    </a>
                  ) : (
                    <input
                      type="url"
                      className="w-full p-2 rounded-md border border-amber-300 dark:border-gray-600 focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                      value={url}
                      onChange={(e) => {
                        const newSocialLinks = [...user.socialLinks];
                        newSocialLinks[index] = e.target.value;
                        setUserData({ ...user, socialLinks: newSocialLinks });
                      }}
                    />
                  )}
                </div>
              ))}
              {editMode && (
                <button
                  className="mt-2 bg-amber-500 hover:bg-amber-600 dark:bg-gray-600 dark:hover:bg-gray-500 text-white py-2 px-4 rounded-full text-sm"
                  onClick={() =>
                    setUserData({
                      ...user,
                      socialLinks: [...user.socialLinks, ""],
                    })
                  }
                >
                  Add Social Link
                </button>
              )}
            </div>
          </div>
          {!id && (
            <div className="mt-8">
              <button
                className="w-full bg-amber-500 hover:bg-amber-600 dark:bg-gray-600 dark:hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-full flex items-center justify-center transition duration-300"
                onClick={() => {
                  if (editMode) updateEditData();
                  setEditMode(!editMode);
                }}
              >
                {!editMode ? (
                  <Edit className="w-5 h-5 mr-2" />
                ) : (
                  <Save className="w-5 h-5 mr-2" />
                )}
                {editMode ? "Save Profile" : "Edit Profile"}
              </button>
            </div>
          )}
        </div>

        {(userData?.badges?.length ?? 0) > 0 && (
          <div className="pt-6 pb-6 pr-6 md:pl-6 bg-orange-500 dark:bg-gray-700 rounded-lg flex gap-2 items-center justify-start md:flex-col">
            <p className="text-white text-center font-extrabold text-lg -rotate-90 md:rotate-0">
              Badges
            </p>
            <div className="flex flex-row md:flex-col gap-4 items-center justify-center">
              {userData?.badges.map((badge) => {
                const badgeInfo = badgeData.find((b) => b.name === badge);
                if (!badgeInfo) return null;
                return (
                  <div className="flex flex-col items-center transition-transform duration-300 ease-in-out transform hover:scale-110">
                    <img
                      key={badgeInfo.name}
                      src={`/assets/${badgeInfo.file}`}
                      alt={badgeInfo.name}
                      className="w-24 h-24 rounded-full shadow-2xl"
                    />
                    <p className="text-white text-center text-sm font-medium">
                      {badgeInfo.name}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          closeOnClick={true}
          pauseOnHover={true}
          draggable={true}
          theme="light"
          transition={Bounce}
        />
      </div>
      <Footer />
    </div>
  );
}

export default Profile;
