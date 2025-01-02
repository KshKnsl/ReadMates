import { useEffect, useMemo, useRef, useState, useContext } from "react";
import {
  MeetingProvider,
  useMeeting,
  useParticipant,
} from "@videosdk.live/react-sdk";
import { toast } from "react-toastify";

import ReactPlayer from "react-player";
import {
  Loader2,
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Users,
  PlusCircle,
  VideoIcon,
  ClipboardCopy,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { AnimatePresence, motion } from "framer-motion";

function JoinScreen({
  getMeetingAndToken,
}: {
  getMeetingAndToken: (meeting?: string) => void;
}) {
  const [meetingId, setMeetingId] = useState<string | undefined>();
  const onClick = async (isCreate: boolean) => {
    getMeetingAndToken(isCreate ? undefined : meetingId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md mx-auto bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 shadow-xl rounded-lg overflow-hidden p-6 space-y-6"
    >
      <div className="flex flex-col items-center">
        <VideoIcon className="w-16 h-16 text-amber-500 mb-4" />
        <h2 className="text-2xl font-bold text-amber-800 dark:text-amber-200 text-center">
          Join or Create a Meeting
        </h2>
        <p className="text-amber-700 dark:text-amber-300 text-center mt-2">
          Enter a meeting ID to join an existing meeting or create a new one.
        </p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Enter Meeting ID"
            value={meetingId}
            onChange={(e) => setMeetingId(e.target.value)}
            className="w-full px-4 py-2 text-amber-900 dark:text-amber-100 bg-white dark:bg-gray-700 border border-amber-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
          />
          <Users className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-500 dark:text-amber-400" />
        </div>

        <div className="flex flex-col space-y-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onClick(false)}
            className="w-full px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!meetingId}
          >
            Join Meeting
          </motion.button>

          <div className="relative">
            <hr className="border-amber-300 dark:border-gray-600" />
            <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-amber-50 dark:bg-[#1B2432] px-2 text-amber-700 dark:text-amber-300">
              or
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onClick(true)}
            className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Create New Meeting
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

function ParticipantView({ participantId }: { participantId: string }) {
  const micRef = useRef<HTMLAudioElement>(null);
  const { webcamStream, micStream, webcamOn, micOn, isLocal, displayName } =
    useParticipant(participantId);

  const videoStream = useMemo(() => {
    if (webcamOn && webcamStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      return mediaStream;
    }
  }, [webcamStream, webcamOn]);

  useEffect(() => {
    if (micRef.current) {
      if (micOn && micStream) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track);
        micRef.current.srcObject = mediaStream;

        micRef.current
          .play()
          .catch((error) => console.error("Error playing mic stream:", error));
      } else {
        micRef.current.srcObject = new MediaStream();
      }
    }
  }, [micStream, micOn]);

  return (
    <div className="mx-auto relative rounded-lg overflow-hidden bg-gray-900 min-w-60 w-full h-full">
      <audio ref={micRef} autoPlay playsInline muted={isLocal} />
      {webcamOn ? (
        <ReactPlayer
          playsinline
          pip={false}
          light={false}
          controls={false}
          muted={true}
          playing={true}
          url={videoStream ? videoStream : undefined}
          width="100%"
          height="100%"
          onError={(err) => {
            console.error(err, "participant video error");
          }}
          className="object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-800">
          <VideoOff className="h-24 w-24 text-gray-400" />
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50">
        <div className="flex items-center justify-between">
          <span className="text-white text-xs font-medium">
            {displayName
              ? `${displayName.slice(0, 10)}${
                  displayName.length > 10 ? "..." : ""
                }`
              : "Participant"}
          </span>
          <div className="flex items-center space-x-2">
            {micOn ? (
              <Mic className="h-4 w-4 text-white" />
            ) : (
              <MicOff className="h-4 w-4 text-red-500" />
            )}
            {webcamOn ? (
              <Video className="h-4 w-4 text-white" />
            ) : (
              <VideoOff className="h-4 w-4 text-red-500" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
function MeetingView() {
  const [micOn, setMicOn] = useState(true);
  const [webcamOn, setWebcamOn] = useState(true);
  const [joined, setJoined] = useState<string | null>(null);
  const [isParticipantListOpen, setIsParticipantListOpen] = useState(false);
  const { participants, join, leave, toggleMic, toggleWebcam } = useMeeting({
    onMeetingJoined: () => {
      setJoined("JOINED");
    },
    onMeetingLeft: () => {
      setJoined(null);
    },
  });

  const participantIds = useMemo(
    () => Array.from(participants.keys()),
    [participants]
  );

  const joinMeeting = () => {
    setJoined("JOINING");
    join();
  };

  const toggleParticipantList = () => {
    setIsParticipantListOpen(!isParticipantListOpen);
  };

  useEffect(() => {
    console.log("Participants updated:", participants);
    if (joined === "JOINED") {
      toast.done("Someone just joined the meeting.");
    }
  }, [participants, joined]);

  return (
    <div className="w-full max-w-4xl mx-auto bg-amber-50 dark:bg-gray-800 shadow-xl rounded-lg">
      <div className="p-2">
        <AnimatePresence mode="wait">
          {joined === "JOINED" ? (
            <motion.div
              key="joined"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="max-w-sm flex gap-4 flex-nowrap md:flex-col flex-row">
                {participantIds.map((participantId) => (
                  <ParticipantView
                    key={participantId}
                    participantId={participantId}
                  />
                ))}
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => {
                    setMicOn((e) => !e);
                    toggleMic();
                  }}
                  className={`p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                    micOn
                      ? "bg-amber-500 hover:bg-amber-600 text-white focus:ring-amber-500"
                      : "bg-red-500 hover:bg-red-600 text-white focus:ring-red-500"
                  }`}
                  aria-label={micOn ? "Mute microphone" : "Unmute microphone"}
                >
                  {micOn ? (
                    <Mic className="h-5 w-5" />
                  ) : (
                    <MicOff className="h-5 w-5" />
                  )}
                </button>
                <button
                  onClick={() => {
                    setWebcamOn((prev) => !prev);
                    toggleWebcam();
                  }}
                  className={`p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                    webcamOn
                      ? "bg-amber-500 hover:bg-amber-600 text-white focus:ring-amber-500"
                      : "bg-red-500 hover:bg-red-600 text-white focus:ring-red-500"
                  }`}
                  aria-label={webcamOn ? "Turn off camera" : "Turn on camera"}
                >
                  {webcamOn ? (
                    <Video className="h-5 w-5" />
                  ) : (
                    <VideoOff className="h-5 w-5" />
                  )}
                </button>
                <button
                  onClick={toggleParticipantList}
                  className={`p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                    isParticipantListOpen
                      ? "bg-green-500 hover:bg-green-600 text-white focus:ring-green-500"
                      : "bg-amber-500 hover:bg-amber-600 text-white focus:ring-amber-500"
                  }`}
                  aria-label={
                    isParticipantListOpen
                      ? "Close participant list"
                      : "Open participant list"
                  }
                >
                  <Users className="h-5 w-5" />
                </button>
                <button
                  onClick={leave}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                  aria-label="Leave meeting"
                >
                  <PhoneOff className="h-5 w-5" />
                </button>
              </div>
              <AnimatePresence>
                {isParticipantListOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden"
                  >
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2 text-amber-800 dark:text-amber-200">
                        Participants ({participantIds.length})
                      </h3>
                      <ul className="space-y-2">
                        {participantIds.map((participantId) => (
                          <li
                            key={participantId}
                            className="text-sm text-gray-700 dark:text-gray-300"
                          >
                            {participants.get(participantId)?.displayName ||
                              "Unnamed Participant"}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : joined === "JOINING" ? (
            <motion.div
              key="joining"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-12"
            >
              <Loader2 className="h-8 w-8 animate-spin text-amber-500 mr-3" />
              <p className="text-lg text-amber-700 dark:text-amber-300">
                Joining the meeting...
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="not-joined"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mx-auto text-center"
            >
              <button
                onClick={joinMeeting}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white text-lg font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors"
              >
                Start meet
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Call() {
  const [meetingId, setMeetingId] = useState<string | null>(null);
  const auth = useContext(AuthContext);
  const userId = auth?.user?._id;
  const [userName, setUserName] = useState("");
  const [token, setToken] = useState<string | null>(null);

  const createMeeting = async ({ token }: { token: string }) => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/call/create-meeting`,
      {
        method: "POST",
        headers: {
          authorization: `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      }
    );
    const { roomId }: { roomId: string } = await res.json();
    return roomId;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/${userId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        setUserName(data.name);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setUserName("Not Known");
      }
    };
    fetchUserData();
    const fetchToken = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/call/token`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch token");
        }
        const data = await response.json();
        setToken(data.token);
      } catch (err) {
        console.error("Error fetching token:", err);
      }
    };
    fetchToken();
  }, [userId]);

  const getMeetingAndToken = async (id?: string) => {
    if (!token) {
      console.error("Token is not set yet");
      return;
    }
    setMeetingId(id == null ? await createMeeting({ token }) : id);
  };

  if (!token) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
        <p className="text-lg text-amber-700 ml-2">Loading...</p>
      </div>
    );
  }

  return token && meetingId ? (
    <MeetingProvider
      config={{
        meetingId,
        micEnabled: true,
        webcamEnabled: true,
        name: `${userName}`,
        debugMode: true,
      }}
      token={token}
    >
       <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 p-4 flex flex-col">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg mb-4 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-amber-800 dark:text-amber-200">Meeting ID</h2>
            <div className="flex items-center mt-1">
              <p className="text-sm text-gray-700 dark:text-gray-300 mr-2">{meetingId}</p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(meetingId);
                  toast.update("Copied!");
                }}
                className="text-amber-500 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300 transition-colors"
              >
                <ClipboardCopy className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="flex-grow bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <MeetingView />
        </div>
      </div>
    </MeetingProvider>
  ) : (
    <JoinScreen getMeetingAndToken={getMeetingAndToken} />
  );
}

export default Call;
