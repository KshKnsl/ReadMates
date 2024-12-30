import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { MeetingProvider, useMeeting, useParticipant,} from "@videosdk.live/react-sdk";
import ReactPlayer from "react-player";
import { Loader2, Video, VideoOff, Mic, MicOff, PhoneOff, Users } from 'lucide-react';
import { AuthContext } from "../context/AuthContext";

interface ParticipantViewProps 
{
  participantId: string;
}

function ParticipantView({ participantId }: ParticipantViewProps) 
{
  const micRef = useRef<HTMLAudioElement>(null);
  const { webcamStream, micStream, webcamOn, micOn, isLocal, displayName } = useParticipant(participantId);

  const videoStream = useMemo(() => {
    if (webcamOn && webcamStream) 
    {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      return mediaStream;
    }
  }, [webcamStream, webcamOn]);

  useEffect(() => {
    if (micRef.current) 
    {
      if (micOn && micStream) 
      {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track);
        micRef.current.srcObject = mediaStream;
        micRef.current
          .play()
          .catch((error) =>
            console.error("videoElem.current.play() failed", error)
          );
      } 
      else    micRef.current.srcObject = null;
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
          url={videoStream}
          width="100%"
          height="100%"
          onError={(err) => {
            console.log(err, "participant video error");
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
            {displayName ? `${displayName.slice(0, 10)}${displayName.length > 10 ? '...' : ''}` : "Participant"}
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

function MeetingView() 
{
  const [micOn, setMicOn] = useState(true);
  const [joined, setJoined] = useState<null | "JOINING" | "JOINED">(null);
  const [webcamOn, setWebcamOn] = useState(true);
  const { join, leave, toggleMic, toggleWebcam, participants } = useMeeting({
    onMeetingJoined: () => {
      setJoined("JOINED");
    },
  });

  const [isParticipantListOpen, setIsParticipantListOpen] = useState(false);

  const joinMeeting = () => {
    setJoined("JOINING");
    join();
  };

  const participantIds = useMemo(() => Array.from(participants.keys()), [participants]);

  const toggleParticipantList = () => {
    setIsParticipantListOpen(!isParticipantListOpen);
  };

  return (
    <div className="mx-auto p-4 bg-amber-100 dark:bg-gray-800">
      {joined === "JOINED" ? (
        <div className="flex flex-col items-center">
          <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-4">
            {participantIds.map((participantId) => (
              <ParticipantView key={participantId} participantId={participantId} />
            ))}
          </div>
          <div className="flex space-x-4 mt-4 mb-2">
            <button
              onClick={() =>{ setMicOn((e)=> !e); toggleMic()}}
              className="p-3 bg-amber-500 text-white rounded-full hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors"
              aria-label="Toggle microphone"
            >
            {micOn ? (
              <Mic className="h-4 w-4 text-white" />
            ) : (
              <MicOff className="h-4 w-4 text-red-200" />
            )}
            </button>
            <button
              onClick={() => {
              setWebcamOn((prev) => !prev);
              toggleWebcam();
              }}
              className="p-3 bg-amber-500 text-white rounded-full hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors"
              aria-label="Toggle webcam"
            >
              {webcamOn ? (
              <Video className="h-4 w-4 text-white" />
              ) : (
              <VideoOff className="h-4 w-4 text-red-200" />
              )}
            </button>
            <button
              onClick={toggleParticipantList}
              className={`p-3 ${isParticipantListOpen ? 'bg-green-500 hover:bg-green-600' : 'bg-amber-500 hover:bg-amber-600'} text-white rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors`}
              aria-label="Toggle participant list"
            >
              <Users className="h-4 w-4" />
            </button>
            <button
              onClick={leave}
              className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              aria-label="Leave call"
            >
              <PhoneOff className="h-4 w-4" />
            </button>
          </div>
          {isParticipantListOpen && (
            <div className="w-full max-w-4xl p-4 rounded-2xl shadow-md dark:text-amber-500">
              <h2 className="text-xl font-bold mb-4 ">Participants ({participantIds.length})</h2>
              <ul>
                {participantIds.map((participantId) => (
                  <li key={participantId} className="mb-2">
                    {participants.get(participantId)?.displayName || "Unnamed Participant"}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : joined === "JOINING" ? (
        <div className="flex items-center justify-center">
          <div className="flex">
            <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
            <p className="text-lg text-amber-700">Joining the meeting...</p>
          </div>
        </div>
      ) : (
        <div className="flex">
          <button
            onClick={joinMeeting}
            className="px-3 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors"
          >
            Join the meeting
          </button>
        </div>
      )}
    </div>
  );
}

const Call = ({ meetID }: { meetID?: string }) => {
  const extractedText = meetID?.split('_').pop()?.split('-')[0];
  let formattedText = extractedText?.replace(/_/g, '').slice(0, 12);
  while (formattedText && formattedText.length < 12) {
    formattedText += 'a';
  }
  console.log(formattedText?.length, formattedText);
  const auth = useContext(AuthContext);
  const userId = auth?.user?._id;

  const [userName, setUserName] = useState("");
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
  }, [userId]);

  return (
    <MeetingProvider
      config={{
        meetingId: "4is0-g0a3-9yel",
        micEnabled: true,
        webcamEnabled: true,
        name: `${userName}`,
        debugMode: true,
      }}
      token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiJmYTkxZjdkZi0xMzk1LTQ5NzQtYmMxNS1iNDI0YzQ4NjZjZjIiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTczNTU0NjUzOSwiZXhwIjoxNzM1NjMyOTM5fQ.l_Ywkgb33aPXge8CLJ3rgOalKTegOt7aVGcw90zgYsU"
    >
      <div className="max-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
        <MeetingView />
      </div>
    </MeetingProvider>
  );
};

export default Call;

