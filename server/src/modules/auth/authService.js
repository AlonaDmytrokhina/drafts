import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {createUser, findUserByEmail} from './authRepository.js'

const SALT_ROUNDS = 10;

export const register = async ({ username, email, password }) => {
  checkRegisterData(username, email, password);

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const newUser = await createUser({username, email, passwordHash});

  return newUser;
};

export const login = async ({ email, password }) => {
  checkLoginData(email, password);

  const user = await findUserByEmail(email);
  checkCredentials(user);

  const match = await bcrypt.compare(password, user.password_hash);
  checkCredentials(match);

  const token = jwt.sign(
    { id: user.id, isAdmin: user.is_admin },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

    const safeUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar_url: user.avatar_url,
        bio: user.bio,
        isAdmin: user.is_admin,
        created_at: user.created_at,
    };

  return {
    accessToken: token,
    user: safeUser,
  };
};


function checkRegisterData(username, email, password){
  if (!username || !email || !password) {
    throw { status: 400, message: 'All fields are required' };
  }
}

function checkLoginData(email, password){
  if (!email || !password) {
    throw { status: 400, message: 'Email and password required' };
  }
}

function checkCredentials(data){
  if (!data) {
    throw { status: 401, message: 'Invalid credentials' };
  }
}