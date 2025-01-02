import { useState, useContext, useEffect } from "react";
import TextEditor from "../components/TextEditor";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { LucideLink, Copy, Check } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import ContributorList from "./ui/ContributorList";
import UserName from "./ui/UserName";
import {motion} from 'framer-motion';
import Call from "../Pages/Call";
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
  const [contributorData, setContributorData] = useState<any>({});
  const [shortData, setShortData] = useState({
    shortlink: `${window.location.origin}/create/${sessionID}`,
    qrurl: "",
  });
  const [colabMode, setColabMode] = useState<boolean>(false);
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
        navigate("/login");
        return;
      }

      if (!sessionID || sessionID === "") {
        const newSessionID = `doc_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 16)}-${auth.user._id}`;
        navigate(`/create/${newSessionID}`);
        return;
      } else if (sessionID.split("-").pop() === auth.user._id) {
        let id = sessionID.split("-").pop();
        let sesID = sessionID;
        const result = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/colab/createColab`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ author: id, sessionId: sesID }),
          }
        );
        if (result.ok) 
        {
          const resul = await result.json();
          setContributorData(resul);
          toast.success("Session Joined Successfully as a author");
          setIsAuthor(true);
        }
        setIsAuthor(true);
      } 
      else 
      {
        let id = auth.user._id;
        let sesID = sessionID;
        const result = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/colab/addContributor`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ contributor: id, sessionId: sesID }),
          }
        );
        if (result.ok) 
        {
          const resul = await result.json();
          setContributorData(resul.Colaborator);
          toast.success("Session Joined Successfully as a Contributor");
          setIsAuthor(false);
        }
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
      try 
      {
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/getArticle/session/${sessionID}`
        );
        const data = await response.json();
        if (data.success) {
          setArticleData(data.article);
        } 
        else 
        {
          setArticleData({
            ...articleData,
            author: auth.user?._id || "",
            contributors: [],
          });
        }
      } 
      catch (error) 
      {
       console.error("Article Does not exists");
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
      <div className="flex flex-col items-center justify-center h-screen bg-amber-50 dark:bg-gray-800">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            times: [0, 0.5, 1],
            repeat: Infinity,
          }}
          className="text-6xl text-amber-600 mb-4"
        >
          ⏳
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-semibold text-amber-600"
        >
          Loading...
        </motion.div>
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
    <div className="mx-auto p-4 flex flex-col-reverse lg:flex-row-reverse bg-amber-50 dark:bg-gray-800 gap-3">
      {(colabMode == true) ? (
      <div className="lg:max-w-sm mx-auto">
        <h1 className="pt-2 text-3xl font-bold text-amber-900 dark:text-amber-300 mb-6">
          {isAuthor ? "Create Collaborative Article" : "Collaborate on Article"}
        </h1>
        {isAuthor && (
          <div className="mb-8 bg-white dark:bg-gray-700 shadow-lg rounded-lg overflow-hidden">
            <div className="bg-amber-100 dark:bg-gray-700 dark:bg-opacity-30 px-6 py-4">
              <h2 className="text-xl font-semibold text-amber-800 dark:text-amber-300 flex items-center">
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
                      className="w-full p-3 pr-12 border border-amber-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50 dark:bg-gray-800 text-amber-800 dark:text-amber-300"
                    />
                    <button
                      onClick={handleCopyLink}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-amber-600 dark:text-amber-300 hover:text-amber-800 dark:hover:text-amber-300 focus:outline-none"
                      aria-label="Copy link"
                    >
                      {copied ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-amber-600 dark:text-amber-300">
                    {copied
                      ? "Link copied to clipboard!"
                      : "Click the icon to copy the link"}
                  </p>
                </div>
                {shortData.qrurl && (
                  <img
                    src={`${shortData.qrurl}`}
                    alt="QR Code for shareable link"
                    className="w-full bg-indigo-500 rounded-lg shadow-md p-1 lg:block hidden dark:bg-gray-900"
                  />
                )}
              </div>
            </div>
          </div>
        )}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-amber-800 dark:text-amber-300 mb-2">
            {isAuthor ? "Author" : "You are collaborating as"}
          </h2>
          <div className="bg-amber-100 dark:bg-gray-700 dark:bg-opacity-30 p-2 rounded dark:text-white">
            <UserName userId={auth.user._id} name={userName} />
          </div>
        </div>
        {contributorData.Contributor?.length>0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-amber-800 dark:text-amber-300 mb-2 ">
              Contributors ID
            </h2>
            <ContributorList
              articleData={contributorData.Contributor || articleData.contributors}
            />
          </div>
        )}
        <Call />
      </div>):(
      <div className="md:max-w-sm">
      <button
        onClick={() => setColabMode(true)}
        className="w-full py-2 px-4 bg-amber-600 text-white font-semibold rounded-md shadow-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-75"
      >
        Start Collaboration
      </button>
      </div>)}

        <TextEditor
          articleData={articleData}
          setArticleData={handleArticleDataChange}
          userName={userName}
          docName={sessionID || ""}
        />
      <ToastContainer />
    </div>
  );
}

export default CreateArticle;
