import { Context } from "@/context/Context";
import { SandpackPreview, useSandpack } from "@codesandbox/sandpack-react";
import React, { useContext, useEffect, useRef } from "react";

const CodePreviewComponent = () => {
    const previewRef = useRef()
    const {sandpack} = useSandpack()
    const {action, setAction} = useContext(Context)
    useEffect(() => {
    getSandpackClient()
    }, [sandpack && action])

   const getSandpackClient = async() =>{
        const client = previewRef.current?.getClient()
        if (client) {
            const result = await client.getCodeSandboxURL();
            console.log(result);
            if (action?.actionType === 'export') {
                window.open('https://'+result?.sandboxId+'.csb.app/')
            }else if(action?.actionType === 'deploy'){
                window.open(result?.editorUrl)
            }
            
        }
    }
  return (
    <>
      <SandpackPreview ref={previewRef} style={{ height: "73vh" }} showNavigator={true} />
    </>
  );
};

export default CodePreviewComponent;
