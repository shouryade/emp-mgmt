import React from "react";
import Section from "./Section";
import Container from "@material-ui/core/Container";
import SectionHeader from "./SectionHeader";
import Auth from "./Auth";

function AuthSection(props) {
  const allTypeValues = {
    signin: {
      title: "Welcome back",
      buttonText: "Sign in",
      linkTextSignup: "Create an account",
    },
    signup: {
      title: "Sign up for an account",
      buttonText: "Sign up",
      linkTextSignin: "Sign in",
    },
  };

  const currentType = allTypeValues[props.type] ? props.type : "signup";
  const typeValues = allTypeValues[currentType];

  return (
    <Section
      bgColor={props.bgColor}
      size={props.size}
      bgImage={props.bgImage}
      bgImageOpacity={props.bgImageOpacity}
    >
      <Container maxWidth="xs">
        <SectionHeader
          title={allTypeValues[currentType].title}
          subtitle=""
          size={4}
          textAlign="center"
        />
        <Auth
          type={currentType}
          typeValues={typeValues}
          providers={props.providers}
          afterAuthPath={props.afterAuthPath}
          key={currentType}
        />
      </Container>
    </Section>
  );
}

export default AuthSection;
