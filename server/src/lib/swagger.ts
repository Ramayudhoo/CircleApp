export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "CircleApp API Documentation",
    version: "1.0.0",
    description: "API Documentation for CircleApp (Forum Social Media application)"
  },
  servers: [
    {
      url: "/api/v1",
      description: "v1 API server"
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "integer" },
          username: { type: "string" },
          name: { type: "string" },
          email: { type: "string" },
          bio: { type: "string" },
          avatar: { type: "string" }
        }
      },
      Thread: {
        type: "object",
        properties: {
          id: { type: "integer" },
          content: { type: "string" },
          image: { type: "string", nullable: true },
          created_at: { type: "string", format: "date-time" },
          user: {
            type: "object",
            properties: {
              id: { type: "integer" },
              username: { type: "string" },
              name: { type: "string" },
              profile_picture: { type: "string", nullable: true }
            }
          },
          likes: { type: "integer" },
          reply: { type: "integer" },
          isLiked: { type: "boolean" }
        }
      },
      Reply: {
        type: "object",
        properties: {
          id: { type: "integer" },
          content: { type: "string" },
          image: { type: "string", nullable: true },
          created_at: { type: "string", format: "date-time" },
          likes: { type: "integer" },
          isLiked: { type: "boolean" },
          user: {
            type: "object",
            properties: {
              id: { type: "integer" },
              username: { type: "string" },
              name: { type: "string" },
              profile_picture: { type: "string", nullable: true }
            }
          }
        }
      },
      Following: {
        type: "object",
        properties: {
          id: { type: "integer" },
          follower_id: { type: "integer" },
          following_id: { type: "integer" },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" }
        }
      },
      Like: {
        type: "object",
        properties: {
          id: { type: "integer" },
          user_id: { type: "integer" },
          thread_id: { type: "integer", nullable: true },
          reply_id: { type: "integer", nullable: true },
          created_at: { type: "string", format: "date-time" }
        }
      }
    }
  },
  paths: {
    "/auth/register": {
      post: {
        summary: "Register a new user",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["username", "name", "email", "password"],
                properties: {
                  username: { type: "string" },
                  name: { type: "string" },
                  email: { type: "string", format: "email" },
                  password: { type: "string", format: "password" }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "Registration successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    code: { type: "integer" },
                    status: { type: "string" },
                    message: { type: "string" },
                    data: {
                      type: "object",
                      properties: {
                        user_id: { type: "integer" },
                        username: { type: "string" },
                        name: { type: "string" },
                        email: { type: "string" },
                        token: { type: "string" }
                      }
                    }
                  }
                }
              }
            }
          },
          400: {
            description: "Bad Request (e.g. username/email already taken)"
          }
        }
      }
    },
    "/auth/login": {
      post: {
        summary: "Login",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["identifier", "password"],
                properties: {
                  identifier: { type: "string", description: "Email or username" },
                  password: { type: "string", format: "password" }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "Login successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    code: { type: "integer" },
                    status: { type: "string" },
                    message: { type: "string" },
                    data: {
                      type: "object",
                      properties: {
                        user_id: { type: "integer" },
                        username: { type: "string" },
                        name: { type: "string" },
                        email: { type: "string" },
                        avatar: { type: "string", nullable: true },
                        bio: { type: "string", nullable: true },
                        token: { type: "string" }
                      }
                    }
                  }
                }
              }
            }
          },
          400: {
            description: "Invalid Login"
          }
        }
      }
    },
    "/threads": {
      get: {
        summary: "Get threads",
        tags: ["Threads"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "limit",
            in: "query",
            schema: { type: "integer" },
            description: "Limit the number of threads returned"
          }
        ],
        responses: {
          200: {
            description: "Successful response",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    code: { type: "integer" },
                    status: { type: "string" },
                    message: { type: "string" },
                    data: {
                      type: "object",
                      properties: {
                        threads: {
                          type: "array",
                          items: { $ref: "#/components/schemas/Thread" }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        summary: "Create a new thread",
        tags: ["Threads"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["content"],
                properties: {
                  content: { type: "string" },
                  image: { type: "string", format: "binary" }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: "Thread created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    code: { type: "integer" },
                    status: { type: "string" },
                    message: { type: "string" },
                    data: {
                      type: "object",
                      properties: {
                        thread: { $ref: "#/components/schemas/Thread" }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/threads/{id}": {
      get: {
        summary: "Get thread detail",
        tags: ["Threads"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" }
          }
        ],
        responses: {
          200: {
            description: "Successful response",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    code: { type: "integer" },
                    status: { type: "string" },
                    message: { type: "string" },
                    data: { $ref: "#/components/schemas/Thread" }
                  }
                }
              }
            }
          },
          404: {
            description: "Thread not found"
          }
        }
      }
    },
    "/threads/{id}/replies": {
      get: {
        summary: "Get replies for a thread",
        tags: ["Threads"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" }
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer" }
          }
        ],
        responses: {
          200: {
            description: "Successful response",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    code: { type: "integer" },
                    status: { type: "string" },
                    message: { type: "string" },
                    data: {
                      type: "object",
                      properties: {
                        replies: {
                          type: "array",
                          items: { $ref: "#/components/schemas/Reply" }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/threads/{id}/like": {
      post: {
        summary: "Toggle like on a thread",
        tags: ["Threads"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" }
          }
        ],
        responses: {
          200: {
            description: "Like toggled successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    code: { type: "integer" },
                    status: { type: "string" },
                    message: { type: "string", example: "Thread liked" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/reply": {
      post: {
        summary: "Create a reply to a thread",
        tags: ["Replies"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "thread_id",
            in: "query",
            required: true,
            schema: { type: "integer" }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["content"],
                properties: {
                  content: { type: "string" },
                  image: { type: "string", format: "binary" }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: "Reply created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    code: { type: "integer" },
                    status: { type: "string" },
                    message: { type: "string" },
                    data: {
                      type: "object",
                      properties: {
                        reply: {
                          type: "object",
                          properties: {
                            id: { type: "integer" },
                            content: { type: "string" },
                            image: { type: "string", nullable: true },
                            created_at: { type: "string", format: "date-time" },
                            user: {
                              type: "object",
                              properties: {
                                id: { type: "integer" },
                                username: { type: "string" },
                                name: { type: "string" },
                                profile_picture: { type: "string", nullable: true }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/reply/{id}/like": {
      post: {
        summary: "Toggle like on a reply",
        tags: ["Replies"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" }
          }
        ],
        responses: {
          200: {
            description: "Like toggled successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    code: { type: "integer" },
                    status: { type: "string" },
                    message: { type: "string", example: "Thread liked" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/user/suggestions": {
      get: {
        summary: "Get suggested users to follow",
        tags: ["User"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "limit",
            in: "query",
            schema: { type: "integer" }
          }
        ],
        responses: {
          200: {
            description: "Successful response",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    code: { type: "integer" },
                    status: { type: "string" },
                    message: { type: "string" },
                    data: {
                      type: "object",
                      properties: {
                        users: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              id: { type: "integer" },
                              username: { type: "string" },
                              name: { type: "string" },
                              avatar: { type: "string" },
                              bio: { type: "string" }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/user/search": {
      get: {
        summary: "Search users",
        tags: ["User"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "q",
            in: "query",
            required: true,
            schema: { type: "string" },
            description: "Search query string"
          }
        ],
        responses: {
          200: {
            description: "Successful response",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    code: { type: "integer" },
                    status: { type: "string" },
                    message: { type: "string" },
                    data: {
                      type: "object",
                      properties: {
                        users: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              id: { type: "integer" },
                              username: { type: "string" },
                              name: { type: "string" },
                              avatar: { type: "string" },
                              is_following: { type: "boolean", nullable: true }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/user/profile": {
      get: {
        summary: "Get current user profile",
        tags: ["User"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Successful response",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    code: { type: "integer" },
                    status: { type: "string" },
                    message: { type: "string" },
                    data: {
                      type: "object",
                      properties: {
                        id: { type: "integer" },
                        username: { type: "string" },
                        name: { type: "string" },
                        email: { type: "string" },
                        bio: { type: "string", nullable: true },
                        avatar: { type: "string", nullable: true },
                        follower_count: { type: "integer" },
                        following_count: { type: "integer" }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      patch: {
        summary: "Update current user profile",
        tags: ["User"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  full_name: { type: "string" },
                  username: { type: "string" },
                  bio: { type: "string" },
                  image: { type: "string", format: "binary" }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "Profile updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    code: { type: "integer" },
                    status: { type: "string" },
                    message: { type: "string" },
                    data: {
                      type: "object",
                      properties: {
                        id: { type: "integer" },
                        username: { type: "string" },
                        full_name: { type: "string" },
                        bio: { type: "string", nullable: true },
                        photo_profile: { type: "string", nullable: true }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/user/{id}/threads": {
      get: {
        summary: "Get threads created by a specific user",
        tags: ["User"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" }
          }
        ],
        responses: {
          200: {
            description: "Successful response",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    code: { type: "integer" },
                    status: { type: "string" },
                    message: { type: "string" },
                    data: {
                      type: "object",
                      properties: {
                        threads: {
                          type: "array",
                          items: { $ref: "#/components/schemas/Thread" }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/user/{id}": {
      get: {
        summary: "Get profile of another user",
        tags: ["User"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" }
          }
        ],
        responses: {
          200: {
            description: "Successful response",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    code: { type: "integer" },
                    status: { type: "string" },
                    message: { type: "string" },
                    data: {
                      type: "object",
                      properties: {
                        id: { type: "integer" },
                        username: { type: "string" },
                        name: { type: "string" },
                        email: { type: "string" },
                        bio: { type: "string", nullable: true },
                        avatar: { type: "string", nullable: true },
                        follower_count: { type: "integer" },
                        following_count: { type: "integer" },
                        is_following: { type: "boolean" }
                      }
                    }
                  }
                }
              }
            }
          },
          404: {
            description: "User not found"
          }
        }
      }
    },
    "/follows": {
      get: {
        summary: "Get followers or following list",
        tags: ["Follows"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "type",
            in: "query",
            required: true,
            schema: { type: "string", enum: ["followers", "following"] }
          },
          {
            name: "user_id",
            in: "query",
            schema: { type: "integer" }
          }
        ],
        responses: {
          200: {
            description: "Successful response",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string" },
                    data: {
                      type: "object",
                      properties: {
                        followers: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              id: { type: "string" },
                              username: { type: "string" },
                              name: { type: "string" },
                              avatar: { type: "string" },
                              is_following: { type: "boolean" }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        summary: "Follow a user",
        tags: ["Follows"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["followed_user_id"],
                properties: {
                  followed_user_id: { type: "string", description: "The ID of the user to follow" }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: "Successfully followed user",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string" },
                    message: { type: "string" },
                    data: {
                      type: "object",
                      properties: {
                        user_id: { type: "string" },
                        is_following: { type: "boolean" }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      delete: {
        summary: "Unfollow a user",
        tags: ["Follows"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["followed_id"],
                properties: {
                  followed_id: { type: "string", description: "The ID of the user to unfollow" }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "Successfully unfollowed user",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string" },
                    message: { type: "string" },
                    data: {
                      type: "object",
                      properties: {
                        user_id: { type: "string" },
                        is_following: { type: "boolean" }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};
