import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type SignupState = {
  agreedAll: boolean;
  tos: boolean;
  privacy: boolean;
  id: string;
  email: string;
  password: string;
};

type Ctx = {
  state: SignupState;
  setAgreements: (p: Partial<Pick<SignupState,"agreedAll"|"tos"|"privacy">>) => void;
  setForm: (p: Partial<Pick<SignupState,"id"|"email"|"password">>) => void;
  reset: () => void;
};

const SignupContext = createContext<Ctx | null>(null);

export const SignupProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<SignupState>({
    agreedAll: false, tos: false, privacy: false,
    id: "", email: "", password: "",
  });

  const setAgreements: Ctx["setAgreements"] = (p) => {
    setState((s) => {
      const next = { ...s, ...p };
      const all = next.tos && next.privacy;
      return { ...next, agreedAll: all };
    });
  };

  const setForm: Ctx["setForm"] = (p) =>
    setState((s) => ({ ...s, ...p }));

  const reset = () => setState({
    agreedAll:false, tos:false, privacy:false, id:"", email:"", password:""
  });

  return (
    <SignupContext.Provider value={{ state, setAgreements, setForm, reset }}>
      {children}
    </SignupContext.Provider>
  );
};

export const useSignup = () => {
  const ctx = useContext(SignupContext);
  if (!ctx) throw new Error("useSignup must be used within SignupProvider");
  return ctx;
};
