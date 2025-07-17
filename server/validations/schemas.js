import Joi from 'joi'

export const showJoiSchema = Joi.object({
  tvmazeId: Joi.number()
    .required()
    .messages({
      'any.required': "Show's TVMaze ID must not be blank"
    }),

  rating: Joi.number()
    .min(1)
    .max(10)
    .messages({
      'number.min': "Show rating must not be less than 1",
      'number.max': "Show rating must not be greater than 10"
    }),
});

export const userJoiSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(20).required().messages({
    'string.base': `Username should be a type of 'text'`,
    'string.empty': `Username cannot be blank`,
    'string.alphanum': `Username cannot have special characters`,
    'string.min': `Username should have at least 3 characters`,
    'string.max': `Username too long! (Over 20 characters)`,
    'any.required': 'Username cannot be blank'
  }),

  email: Joi.string().email().required().messages({
    'string.empty': `Email cannot be blank`,
    'any.required': 'Email cannot be blank',
    'string.email': 'Email must be valid'
  }),

  password: Joi.string().min(8).required().messages({
    'string.empty': `Password cannot be blank`,
    'string.min': `Password should have at least 8 characters`,
    'any.required': 'Password cannot be blank'
  }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required()
    .messages({ 'any.only': 'Passwords do not match' }),

  showsList: Joi.array().items(showJoiSchema),

  listTitle: Joi.string().trim().max(100).pattern(/^[a-zA-Z0-9 _\-]+$/)
});

export const listJoiSchema = Joi.object({
  title: Joi.string().trim()
    .max(100)
    .messages({
      'string.max': 'List title too long! (Over 100 characters)'
    }).optional(),

  order: Joi.array().items(Joi.number().min(0).required()).optional(),

  sorting: Joi.object({
    key: Joi.string().valid('name', 'rating', 'dateAdded', 'custom').required(),
    ascending: Joi.boolean().required()
  }).optional()
});