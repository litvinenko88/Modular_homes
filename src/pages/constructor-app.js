import { useState } from 'react';
import Head from "next/head";
import ModularConstructor from "../components/ConstructorApp/constructor/ModularConstructor";

export default function ConstructorApp() {
  return (
    <>
      <Head>
        <title>3D Конструктор | Easy House</title>
      </Head>
      <ModularConstructor />
    </>
  );
}