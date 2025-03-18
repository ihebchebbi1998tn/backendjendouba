
/**
 * Messagerie Routes - Handles all messaging-related API endpoints
 * 
 * These routes handle sending, receiving, and managing messages between users,
 * including conversations management and unread message counting.
 */
const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getMessage,
  getConversation,
  getUserConversations,
  deleteMessage,
  getUnreadCount
} = require("../controllers/messagerieController");
const { protect } = require("../middleware/auth");
const {
  messageValidation,
  messageIdValidation,
  conversationValidation
} = require("../middleware/messagerieValidation");

/**
 * Authentication Middleware
 * All messagerie routes require authentication
 */
router.use(protect);

/**
 * @route   POST /api/messagerie
 * @desc    Send a new message to another user
 * @access  Private - Requires authentication
 * @body    {id_destinataire, texte}
 * @returns Created message data
 */
router.post("/", messageValidation, sendMessage);

/**
 * @route   GET /api/messagerie/conversations
 * @desc    Get all conversations for the current user
 * @access  Private - Requires authentication
 * @returns Array of conversations with latest messages and user details
 */
router.get("/conversations", getUserConversations);

/**
 * @route   GET /api/messagerie/conversations/:userId
 * @desc    Get conversation with a specific user
 * @access  Private - Requires authentication
 * @param   userId - ID of the other user in the conversation
 * @query   {limit, offset} - Pagination parameters
 * @returns Array of messages between users and user details
 */
router.get("/conversations/:userId", conversationValidation, getConversation);

/**
 * @route   GET /api/messagerie/unread-count
 * @desc    Get count of unread messages for current user
 * @access  Private - Requires authentication
 * @returns Number of unread messages
 */
router.get("/unread-count", getUnreadCount);

/**
 * @route   GET /api/messagerie/:id
 * @desc    Get a specific message by ID
 * @access  Private - Requires authentication and message access rights
 * @param   id - Message ID
 * @returns Message data
 */
router.get("/:id", messageIdValidation, getMessage);

/**
 * @route   DELETE /api/messagerie/:id
 * @desc    Delete a message
 * @access  Private - Requires authentication and ownership
 * @param   id - Message ID
 * @returns Success message
 */
router.delete("/:id", messageIdValidation, deleteMessage);

module.exports = router;
