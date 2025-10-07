"use server"; // ensures it runs in the Node.js server runtime

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { SendEmailTemplate } from "../../emails/sendverificationcodeTemplate";

export function renderEmailHTML(username: string, otp: string) {
  return renderToStaticMarkup(
    <SendEmailTemplate username={username} otp={otp} />
  );
}
