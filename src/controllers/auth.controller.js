// src/controllers/auth.controller.js
import { auth } from "../services/firebase.js";
import axios from "axios";

export const registerUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name
    });

    res.status(201).json({
      message: "Usuario registrado correctamente",
      uid: userRecord.uid,
      name: userRecord.displayName
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Hacemos login usando REST API de Firebase Auth
    const firebaseLoginURL =
    "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBynWIgjSlcz5rvIOZ9MdtRH5KPcWzv1hA";

    const response = await axios.post(firebaseLoginURL, {
      email,
      password,
      returnSecureToken: true
    });

    const { idToken, refreshToken, localId } = response.data;

    // 2. Verificamos el token con Firebase Admin (opcional pero recomendado)
    const decoded = await auth.verifyIdToken(idToken);

    res.status(200).json({
      message: "Login exitoso",
      uid: decoded.uid,
      email: decoded.email,
      idToken,
      refreshToken
    });

  } catch (error) {
    res.status(400).json({
      error: error.response?.data?.error?.message || error.message
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const listUsers = await auth.listUsers(1000); // máximo 1000 por petición

    const users = listUsers.users.map(user => ({
      uid: user.uid,
      email: user.email,
      name: user.displayName,
      disabled: user.disabled,
      createdAt: user.metadata.creationTime
    }));

    res.status(200).json(users);

  } catch (error) {
    res.status(500).json({
      error: "Error listando usuarios",
      details: error.message
    });
  }
};
