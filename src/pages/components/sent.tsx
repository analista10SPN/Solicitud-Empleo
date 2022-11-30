import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboardCheck,
  faDoorOpen,
} from "@fortawesome/free-solid-svg-icons";

interface sentProps {
  email: string;
}

export default function Sent({ email }: sentProps) {
  return (
    <div className="block pt-2">
      <div className="flex justify-center">
        <FontAwesomeIcon
          className="h-36 w-36 text-green-500"
          icon={faClipboardCheck}
        />
      </div>
      <span className="block pt-8 text-center text-3xl font-semibold">
        Solicitud enviada satisfactoriamente
      </span>
      <div className="flex justify-center pt-2">
        <p className="flex justify-self-center whitespace-normal">
          Revise su correo ({email}) para más información.
        </p>
      </div>
      <div className="flex justify-center pt-6">
        <button
          className="flex rounded-md bg-[color:var(--stepperColor)] px-4 py-2 text-white shadow-md hover:bg-slate-500"
          onClick={() => {
            window?.location?.reload();
          }}
        >
          <FontAwesomeIcon
            className="mt-1 mr-2 h-4 w-4 align-middle text-white"
            icon={faDoorOpen}
          />
          Salir
        </button>
      </div>
    </div>
  );
}
