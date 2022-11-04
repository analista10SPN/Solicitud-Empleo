// src/pages/api/examples.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../server/db/client";

const formOptionsNacionalidades = async (req: NextApiRequest, res: NextApiResponse) => {
  const formOptions = await prisma.nacionalidades.findMany();
  // res.status(200).json(examples);
  res.status(200).json(formOptions);
};

export default formOptionsNacionalidades;
