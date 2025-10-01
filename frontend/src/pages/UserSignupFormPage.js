import React from "react";
import "../css/Footer.css"; // Eğer özel stil gerekiyorsa

const UserSignupFormPage = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "2rem", padding: "0 1rem" }}>
      <div
        style={{
          position: "relative",
          paddingBottom: "160%",
          height: 0,
          overflow: "hidden",
          maxWidth: "100%",
        }}
      >
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSdx_YDrag7HjcIzt3PQSnCF9lqQKNq0W_ddWies-K6QtxvcEg/viewform?embedded=true"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: 0,
          }}
          title="Oto Envanter Kayıt"
        >
          Yükleniyor…
        </iframe>
      </div>
    </div>
  );
};

export default UserSignupFormPage;
