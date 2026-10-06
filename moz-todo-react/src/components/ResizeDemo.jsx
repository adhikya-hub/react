import { useEffect } from "react";

function ResizeDemo() {
  useEffect(() => {
    function handleResize() {
      console.log("Width:", window.innerWidth);
    }

    console.log("Adding resize listener");

    window.addEventListener("resize", handleResize);

    return () => {
      console.log("Removing resize listener");
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <h2>Resize the window and check the console.</h2>;
}

export default ResizeDemo;
