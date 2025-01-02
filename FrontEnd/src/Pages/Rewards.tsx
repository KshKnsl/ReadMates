import Badge from "../components/Badge";
import { Award, Lock, CheckCircle } from "lucide-react";
import { badges } from "../constants";
import { AuthContext } from "../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Rewards = () => {
  
  const [userBadges, setUserBadges] = useState<string[]>([]);
  const earnedBadges = badges.filter((badge) => userBadges.includes(badge.name));
  const unearnedBadges = badges.filter((badge) => !userBadges.includes(badge.name));
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if(auth.loading) return;
    if (!auth.user) {
      navigate("/login");
      return;
    }
    const fetchUserData = async () => {
      try {
        const userId = auth?.user?._id;
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/${userId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        setUserBadges(data.badges);
      } 
      catch (err) 
      {
        console.error("Error fetching user data:", err);
      } 
    };
    fetchUserData();
  }, [auth.user]);

  return (
    <div className="min-h-screen bg-amber-50 dark:bg-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2 bg-white dark:bg-gray-700 rounded-2xl shadow-xl p-6 transform transition-all hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Award className="w-10 h-10 mr-4 text-amber-600" />
                <div>
                  <h1 className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                    Your Rewards Journey
                  </h1>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Badges, achievements, and your progress
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-amber-600">
                    {earnedBadges.length}/{badges.length}
                  </div>
                  <div className="text-xs text-amber-700 dark:text-amber-300">
                    Badges Earned
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 mt-4">
              <div
                className="bg-amber-600 h-2.5 rounded-full"
                style={{
                  width: `${(earnedBadges.length / badges.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Quick Tips Card */}
          <div className="bg-white dark:bg-gray-700 rounded-2xl shadow-xl p-6 transform transition-all hover:scale-[1.02]">
            <h2 className="text-xl font-semibold text-amber-700 dark:text-amber-300 mb-4">
              Quick Tips
            </h2>
            <ul className="space-y-2">
              {[
                "Publish regularly",
                "Engage with community",
                "Provide valuable feedback",
                "Stay consistent",
              ].map((tip, index) => (
                <li
                  key={index}
                  className="flex items-center text-sm text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-300 transition-colors"
                >
                  <CheckCircle className="w-5 h-5 mr-2 text-amber-500" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Badges Section */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Earned Badges */}
          <div className="bg-white dark:bg-gray-700 rounded-2xl shadow-xl p-6 transform transition-all hover:scale-[1.01]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                Earned Badges
              </h2>
              <div className="text-sm text-amber-700 dark:text-amber-300">
                {earnedBadges.length} / {badges.length} Completed
              </div>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
              {earnedBadges.map((badge) => (
                <div
                  key={badge.name}
                  className="flex flex-col items-center transform transition-transform hover:scale-110"
                >
                  <Badge {...badge} />
                  <span className="text-xs text-amber-700 dark:text-amber-300 mt-2 text-center">
                    {badge.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Badges to Earn */}
          <div className="bg-white dark:bg-gray-700 rounded-2xl shadow-xl p-6 transform transition-all hover:scale-[1.01]">
            <h2 className="text-2xl font-bold text-amber-700 dark:text-amber-300 mb-6">
              Upcoming Badges
            </h2>
            <div className="space-y-4">
              {unearnedBadges.map((badge) => (
                <div
                  key={badge.name}
                  className="flex items-center justify-between bg-amber-100 dark:bg-gray-700 p-4 rounded-xl hover:bg-amber-200 dark:hover:bg-opacity-30 transition-colors"
                >
                  <div className="flex items-center">
                    <Badge {...badge} />
                    <div className="ml-4">
                      <h3 className="font-semibold text-amber-700 dark:text-amber-300">
                        {badge.name}
                      </h3>
                      <p className="text-xs text-amber-700 dark:text-amber-300">
                        {badge.description}
                      </p>
                    </div>
                  </div>
                  <Lock className="w-6 h-6 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rewards;
