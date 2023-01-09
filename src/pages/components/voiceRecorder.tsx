import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faMicrophone,
  faStop,
} from "@fortawesome/free-solid-svg-icons";

interface fileProps {
  nombre: string;
  extension: string;
  descripcion: string;
  binary: string;
}

interface voiceRecorderProps {
  fileArray: fileProps[];
  setFileArray: Dispatch<SetStateAction<fileProps[]>>;
}

export default function VoiceRecorder({
  fileArray,
  setFileArray,
}: voiceRecorderProps) {
  const description = "Mensaje de Voz";

  const stopButtonRef = useRef<HTMLButtonElement>(null);

  const [blobUrl, setBlobUrl] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  function startRecording() {
    setIsRecording(true);
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then(function (stream) {
        const options = { mimeType: "audio/webm" };
        const recordedChunks: any = [];
        const mediaRecorder = new MediaRecorder(stream, options);

        mediaRecorder.addEventListener("dataavailable", function (e: any) {
          if (e.data.size > 0) recordedChunks.push(e.data);
        });

        mediaRecorder.addEventListener("stop", function () {
          console.log("RECORDED CHUNKS", recordedChunks);
          setBlobUrl(URL.createObjectURL(new Blob(recordedChunks)));
          let blob = new Blob(recordedChunks, { type: "ogg" });
          const reader = new FileReader();
          reader.readAsBinaryString(blob);
          reader.onload = (ev: any) => {
            // convert it to base64

            const file: fileProps = {
              nombre: "mensaje_grabado",
              extension: ".webm",
              descripcion: description,
              binary: `data:audio/webm;codecs=opus;base64,${btoa(
                ev.target.result
              )}`,
            };

            // var snd = new Audio(
            //   `data:audio/webm;codecs=opus;base64,${btoa(ev.target.result)}`
            // );
            // snd.play();
            console.log("FILE AUDIO", file);

            setFileArray([...fileArray, file]);
          };
          //   console.log("URL BLOB", blob);
        });

        if (stopButtonRef && stopButtonRef.current)
          stopButtonRef?.current?.addEventListener(
            "click",
            function onStopClick() {
              mediaRecorder.stop();
              this.removeEventListener("click", onStopClick);
              setIsRecording(false);
            }
          );

        mediaRecorder.start();
      });
  }

  //   const { startRecording, stopRecording, register, status } = useRecorder();

  //   const startVoiceRecording = () => {
  //     clearBlobUrl();
  //     const fileArrayClean = fileArray.filter((file) => {
  //       file.descripcion !== description;
  //     });
  //     setFileArray(fileArrayClean);
  //     startRecording();
  //   };

  //   const stopVoiceRecording = async () => {
  //     stopRecording();
  //     console.log("MEDIABLOBURL", mediaBlobUrl);
  //     if (mediaBlobUrl !== undefined) {
  //       const blob = await fetch(mediaBlobUrl).then((r) => r.blob());
  //       // const audioURL = window.URL.createObjectURL(blob);

  //       var reader = new window.FileReader();
  //       reader.readAsDataURL(blob);
  //       reader.onloadend = function () {
  //         const file: fileProps = {
  //           nombre: "comentario_grabado",
  //           descripcion: description,
  //           extension: "mp3",
  //           binary: reader.result ? (reader.result as string) : "",
  //         };
  //         console.log("AUDIO RECORDING", file);
  //       };
  //     }
  //   };

  //   const [isNativeShare, setNativeShare] = useState(false);
  //   useEffect(() => {
  //     if (navigator) {
  //       setNativeShare(true);
  //     }
  //   }, []);

  //   const [recording, setRecording] = useState(false);
  //   const [chunks, setChunks] = useState<Blob[]>([]);
  //   const [audioURL, setAudioURL] = useState("");

  //   const recordingFunc = () => {
  //     if (
  //       isNativeShare &&
  //       navigator.mediaDevices &&
  //       navigator.mediaDevices.getUserMedia
  //     ) {
  //       console.log("getUserMedia supported.");
  //       navigator.mediaDevices
  //         .getUserMedia(
  //           // constraints - only audio needed for this app
  //           {
  //             audio: true,
  //           }
  //         )

  //         // Success callback
  //         .then((stream) => {
  //           const mediaRecorder = new MediaRecorder(stream);
  //           console.log("Recording...");
  //           if (recording) {
  //             mediaRecorder.start();

  //             mediaRecorder.ondataavailable = (e) => {
  //               setChunks([...chunks, e.data]);
  //             };
  //           }

  //           mediaRecorder.stop();
  //           const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
  //           setAudioURL(window.URL.createObjectURL(blob));
  //         })

  //         // Error callback
  //         .catch((err) => {
  //           console.error(`The following getUserMedia error occurred: ${err}`);
  //         });
  //     } else {
  //       console.log("getUserMedia not supported on your browser!");
  //     }
  //   };

  return (
    <div className="pt-2">
      {!blobUrl && (
        <>
          {!isRecording && (
            <button
              onClick={startRecording}
              className="flex justify-end rounded-full border-2 border-[color:var(--stepperColor)] bg-white p-2 hover:bg-gray-200 hover:shadow-lg"
            >
              <FontAwesomeIcon
                className="h-6 w-6 justify-center bg-transparent text-[color:var(--stepperColor)]"
                icon={faMicrophone}
              />
            </button>
          )}

          {isRecording && (
            <button
              ref={stopButtonRef}
              className="flex justify-end rounded-full border-2 border-red-500 bg-white p-2 hover:bg-gray-200 hover:shadow-lg"
            >
              <FontAwesomeIcon
                className="h-6 w-6 justify-center bg-transparent text-red-500"
                icon={faStop}
              />
            </button>
          )}
        </>
      )}

      {/* <a download="file.wav" href={blobUrl}>
        {"download audio"}
      </a> */}
      {blobUrl ? (
        <>
          <audio id="player" src={blobUrl} controls className="pb-2"></audio>
          <div className="flex justify-end">
            <button
              onClick={() => {
                setBlobUrl("");
                const fileArrayUpdated = fileArray.filter((file) => {
                  file.descripcion !== description;
                });
                setFileArray(fileArrayUpdated);
              }}
              className="flex justify-end rounded-full border-2 border-red-500 bg-white p-2 hover:bg-gray-200 hover:shadow-md"
            >
              <FontAwesomeIcon
                className="h-6 w-6 justify-center text-red-500"
                icon={faTrash}
              />
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
