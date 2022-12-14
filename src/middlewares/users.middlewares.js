import bcrypt from "bcrypt";
import { newUserSchema, userLoginSchema } from "../schemas/users.schemas.js";
import * as userRepository from "../repositories/users.repository.js";

async function validateNewUser(req, res, next) {
  const newUser = req.body;
  const newUserValidation = newUserSchema.validate(newUser, {
    abortEarly: false,
  });
  if (newUserValidation.error) {
    const errors = newUserValidation.error.details.map(
      (details) => details.message
    );
    return res.status(422).send(errors);
  }

  try {
    const existingUser = await userRepository.findExistingUser(req.body.email);

    if (existingUser.length !== 0) {
      return res.status(409).send({ error: "User already exists!" });
    }
    next();
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

async function validateLogin(req, res, next) {
  const { email, password } = req.body;
  let passwordIsValid = undefined;
  const loginValidation = userLoginSchema.validate(req.body, {
    abortEarly: false,
  });

  if (loginValidation.error) {
    const errors = loginValidation.error.details.map(
      (details) => details.message
    );
    return res.status(422).send(errors);
  }

  try {
    const existingUser = await userRepository.findExistingUser(email);

    if (existingUser.length !== 0) {
      passwordIsValid = bcrypt.compareSync(password, existingUser[0].password);
    }
    if (existingUser.length !== 0 && passwordIsValid) {
      res.locals.user_id = existingUser[0].id;
      res.locals.username = existingUser[0].username;
      res.locals.picture_url = existingUser[0].picture_url;
      next();
    } else {
      return res.status(401).send({ error: "E-mail or password are invalid" });
    }
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export { validateNewUser, validateLogin };
