import { useState, useCallback, useContext, useEffect } from "react";
import TextEditor from "./TextEditor";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

interface Collaborator {
  _id: string;
  email: string;
  name: string;
}

interface Article {
  title: string;
  desc: string;
  content: object;
  author: string;
  contributors: Collaborator[];
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
  const [articleData, setArticleData] = useState<Article>();
  const [collaborators] = useState<Collaborator[]>([]);
  const [newCollaboratorEmail, setNewCollaboratorEmail] = useState<string>("");

  useEffect(() => {
    const checkAuthAndSession = async () => {
      if (auth.loading) return;
      if (!auth.user) {
        console.log("Redirecting to login because user is null.");
        navigate("/login");
        return;
      }
      if (!sessionID || sessionID === "") {
        navigate(`/create/${auth?.user?._id}`);
      }
    };

    const fetchUserName = async (id: string) => {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/${id}`);
      const resu = await response.json();
      setUserName(resu.name);
    };

    const loadData = async () => {
      await checkAuthAndSession();
      if (auth?.user?._id) {
        await fetchUserName(auth.user._id);
      }
      setLoading(false);
      
    };

    loadData();
  }, [auth, sessionID, navigate]);

  const handleAddCollaborator = useCallback(() => {
    if (
      newCollaboratorEmail &&
      !collaborators.some((c) => c.email === newCollaboratorEmail)
    ) {
      setNewCollaboratorEmail("");
    }
  }, [newCollaboratorEmail, collaborators]);

  if (loading || !userName || userName === "") {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-2xl font-semibold text-amber-600 mb-4">Loading...</div>
      </div>
    );
  }

  if (auth.user && auth.user._id)
    return (
      <div className="flex md:flex-row-reverse flex-col">
        {auth?.user?._id == sessionID && (
          <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-3xl font-bold text-amber-900 mb-6">
              Create Collaborative Article
            </h1>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-amber-800 mb-2">
                Collaborators
              </h2>
              <div className="flex mb-2">
                <input
                  type="email"
                  placeholder="Enter collaborator's email"
                  value={newCollaboratorEmail}
                  onChange={(e) => setNewCollaboratorEmail(e.target.value)}
                  className="flex-grow p-2 border border-amber-300 rounded-l focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  onClick={handleAddCollaborator}
                  className="bg-amber-500 text-white px-4 py-2 rounded-r hover:bg-amber-600 transition-colors"
                >
                  Add
                </button>
              </div>
              <ul className="space-y-2">
                {collaborators.map((collaborator, index) => (
                  <li key={index} className="bg-amber-100 p-2 rounded">
                    {collaborator.name} ({collaborator.email})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        {!loading && (
          <div className="mb-6">
            <div>
              {articleData ? JSON.stringify(articleData) : "No article data"}
            </div>
            <TextEditor
              articleData={articleData}
              setArticleData={setArticleData}
              userName={userName}
            />
          </div>
        )}
      </div>
    );
  else
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-2xl font-semibold text-red-600 mb-4">Please Login First</div>
        <Link to="/login" className="text-amber-500 hover:underline">Login</Link>
      </div>
    );
}

export default CreateArticle;
