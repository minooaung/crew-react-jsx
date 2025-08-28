export default function ErrorAlert({ error, variant = "default" }) {
  if (!error) return null;

  const containerClass =
    variant === "auth"
      ? "bg-red-500 text-white p-4 rounded-lg mb-4"
      : "rounded-md bg-red-100 text-red-800 p-4 mb-4";

  const textClass = "text-sm font-medium";

  const renderMessages = () => {
    if (typeof error === "string") {
      return <p className={textClass}>{error}</p>;
    }

    if (typeof error === "object" && error !== null) {
      return Object.keys(error).map((key) => {
        const value = error[key];
        const message = Array.isArray(value) ? value[0] : value;
        return (
          <p key={key} className={textClass}>
            {message}
          </p>
        );
      });
    }

    return null;
  };

  return (
    <div className={containerClass}>
      <div className="flex">
        <div className="ml-3">{renderMessages()}</div>
      </div>
    </div>
  );
}

// export default function ErrorAlert({ error }) {
//   if (!error) return null;

//   const renderError = () => {
//     if (typeof error === "string") {
//       return <p className="text-sm font-medium text-red-800">{error}</p>;
//     }

//     if (typeof error === "object") {
//       return Object.keys(error).map((key) => (
//         <p key={key} className="text-sm font-medium text-red-800">
//           {Array.isArray(error[key]) ? error[key][0] : error[key]}
//         </p>
//       ));
//     }

//     return null;
//   };

//   return (
//     <div className="rounded-md bg-red-100 p-4 mb-4">
//       <div className="flex">
//         <div className="ml-3">{renderError()}</div>
//       </div>
//     </div>
//   );
// }
