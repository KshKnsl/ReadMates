import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const UserName = ({ userId, name }: { userId: string; name?: string }) => {
  const [user, setUser] = useState<{
    name: string;
    email: string;
    _id: string;
  } | null>(name ? { name, email: "", _id: userId } : null);

  async function getUserByID(id: string) {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/user/${id}`
    );
    const data = await response.json();
    return { name: data.name, email: data.email, _id: data._id };
  }

  useEffect(() => {
    if (!name) {
      async function fetchUser() {
        const userDetails = await getUserByID(userId);
        setUser(userDetails);
      }
      fetchUser();
    }
  }, [userId, name]);

  if (!user) {
    return <div>Gemini</div>;
  }

  return (
    <Link
      to={`/profile/${user._id}`}
      style={{
        textDecoration: "none",
        color: "inherit",
        fontWeight: "400",
        transition: "all 0.3s ease-in-out",
      }}
      onClick={(e) => {
        e.stopPropagation();
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "indigo";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "inherit";
      }}
    >
      {user.name}
    </Link>
  );
};

export default UserName;
