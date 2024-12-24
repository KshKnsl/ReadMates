import { useState, useContext, useEffect } from "react";
import TextEditor from "../components/TextEditor";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { LucideLink, Copy, Check } from "lucide-react";

interface Article {
  title: string;
  desc: string;
  content: object;
  author: string;
  contributors: string[];
  tags: string[];
  status: "draft" | "published" | "under_review";
  publishedAt?: Date;
}

function CreateArticle() {
  const { sessionID } = useParams<{ sessionID: string }>();
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>("");
  const [isAuthor, setIsAuthor] = useState<boolean>(false);
  const [shortData, setShortData] = useState({
    shortlink: `${window.location.origin}/create/${sessionID}`,
    qrurl: "",
  });
  const [copied, setCopied] = useState(false);

  const [articleData, setArticleData] = useState<Article>({
    title: "",
    desc: "",
    content: {},
    author: "",
    contributors: [],
    tags: [],
    status: "draft",
  });

  useEffect(() => {
    const checkAuthAndSession = async () => {
      if (auth.loading) return;
      if (!auth.user) {
        console.log("Redirecting to login because user is not authenticated.");
        navigate("/login");
        return;
      }
      if (!sessionID || sessionID === "") {
        const newSessionID = `doc_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}-${auth.user._id}`;
        navigate(`/create/${newSessionID}`);
        return;
      } else if (sessionID.split("-").pop() === auth.user._id) {
        setIsAuthor(true);
      }
    };
    const fetchUserName = async (id: string) => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/${id}`
        );
        const data = await response.json();
        setUserName(data.name);
      } catch (error) {
        console.error("Error fetching user name:", error);
      }
    };

    const fetchArticleData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/article/${sessionID}`
        );
        if (response.ok) {
          const data = await response.json();
          setArticleData(data);
        } else {
          setArticleData({
            ...articleData,
            author: auth.user?._id || "",
            contributors: [],
          });
        }
      } catch (error) {
        console.error("Error fetching article data:", error);
      }
    };

    const loadData = async () => {
      await checkAuthAndSession();
      if (auth?.user?._id) {
        await fetchUserName(auth.user._id);
        await fetchArticleData();
        const tinyu = await fetch("https://tinyu.vercel.app/api/shorten", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: `${window.location.origin}/create/${sessionID}`,
          }),
        }).then((res) => res.json());
        setShortData(tinyu);
      }
      setLoading(false);
    };

    loadData();
  }, [auth, sessionID, navigate]);

  const handleArticleDataChange = (newData: Partial<Article>) => {
    setArticleData((prevData) => ({ ...prevData, ...newData }));
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${shortData.shortlink}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading || !userName) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-2xl font-semibold text-amber-600 mb-4">
          Loading...
        </div>
      </div>
    );
  }

  if (!auth.user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-2xl font-semibold text-red-600 mb-4">
          Please Login First
        </div>
        <Link to="/login" className="text-amber-500 hover:underline">
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto p-4 flex flex-col md:flex-row-reverse">
      <div>
        <h1 className="pt-2 text-3xl font-bold text-amber-900 mb-6">
          {isAuthor ? "Create Collaborative Article" : "Collaborate on Article"}
        </h1>
        {isAuthor && (
          <div className="mb-8 bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="bg-amber-100 px-6 py-4">
              <h2 className="text-xl font-semibold text-amber-800 flex items-center">
                <LucideLink className="w-5 h-5 mr-2" />
                Shareable Link
              </h2>
            </div>
            <div className="p-5">
              <div className="flex flex-col gap-4">
                <div className="flex-grow">
                  <div className="relative">
                    <input
                      type="text"
                      value={`${shortData.shortlink}`}
                      readOnly
                      className="w-full p-3 pr-12 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50 text-amber-800"
                    />
                    <button
                      onClick={handleCopyLink}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-amber-600 hover:text-amber-800 focus:outline-none"
                      aria-label="Copy link"
                    >
                      {copied ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-amber-600">
                    {copied
                      ? "Link copied to clipboard!"
                      : "Click the icon to copy the link"}
                  </p>
                </div>
                    {shortData.qrurl && (
                      <img
                        src={`${shortData.qrurl}`}
                        alt="QR Code for shareable link"
                        className="w-full bg-indigo-500 rounded-lg shadow-md p-1"
                      />
                    )}
              </div>
            </div>
          </div>
        )}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-amber-800 mb-2">
            {isAuthor ? "Author" : "You are collaborating as"}
          </h2>
          <div className="bg-amber-100 p-2 rounded">{userName}</div>
        </div>
        {articleData.contributors.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-amber-800 mb-2">
              Contributors
            </h2>
            <ul className="space-y-2">
              {articleData.contributors.map((contributor, index) => (
                <li key={index} className="bg-amber-100 p-2 rounded">
                  {contributor}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div>
        <TextEditor
          articleData={articleData}
          setArticleData={handleArticleDataChange}
          userName={userName}
          docName={sessionID || ""}
        />
      </div>
    </div>
  );
}

export default CreateArticle;
