
const Messagerie = require("../models/messagerieModel");
const User = require("../models/userModel");
const Session = require("../models/sessionModel");
const { validationResult } = require("express-validator");

// Send a new message
exports.sendMessage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check if recipient exists
    const recipient = await User.findById(req.body.id_destinataire);
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    const senderId = req.user.id;
    const recipientId = req.body.id_destinataire;

    // Check if a session already exists between these users
    let session = await Session.findBetweenUsers(senderId, recipientId);
    
    // If no session exists, create one
    if (!session) {
      const sessionData = {
        userId1: senderId,
        userId2: recipientId,
        isActive: true
      };
      
      const sessionId = await Session.create(sessionData);
      session = await Session.getById(sessionId, false);
      console.log(`New session created between users ${senderId} and ${recipientId}: Session ID ${sessionId}`);
    }

    const messageData = {
      id_expediteur: senderId,
      id_destinataire: recipientId,
      texte: req.body.texte,
    };

    const messageId = await Messagerie.create(messageData);
    const message = await Messagerie.getById(messageId);

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: {
        message,
        session: session || null
      },
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a specific message by ID
exports.getMessage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const message = await Messagerie.getById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Only allow access if user is sender or recipient
    if (message.id_expediteur !== req.user.id && message.id_destinataire !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to access this message" });
    }

    // If recipient is viewing, mark as read
    if (message.id_destinataire === req.user.id && !message.is_read) {
      await Messagerie.markAsRead(message.id);
      message.is_read = true;
    }

    res.status(200).json({ success: true, data: message });
  } catch (error) {
    console.error("Error getting message:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get conversation between current user and another user
exports.getConversation = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const otherUserId = parseInt(req.params.userId);
    const currentUserId = req.user.id;
    
    // Check if other user exists
    const otherUser = await User.findById(otherUserId);
    if (!otherUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get pagination parameters
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const messages = await Messagerie.getConversation(currentUserId, otherUserId, limit, offset);
    
    // Mark all unread messages in this conversation as read
    await Messagerie.markConversationAsRead(currentUserId, otherUserId);

    res.status(200).json({ 
      success: true, 
      data: {
        messages,
        otherUser: {
          user_id: otherUser.user_id,
          nom: otherUser.nom,
          prenom: otherUser.prenom,
          profile_image: otherUser.profile_image
        }
      }
    });
  } catch (error) {
    console.error("Error getting conversation:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all conversations for current user
exports.getUserConversations = async (req, res) => {
  try {
    const conversations = await Messagerie.getUserConversations(req.user.id);
    
    // Fetch user details for each conversation
    const conversationsWithUserDetails = await Promise.all(
      conversations.map(async (conv) => {
        const otherUser = await User.findById(conv.other_user_id);
        return {
          ...conv,
          other_user: otherUser ? {
            user_id: otherUser.user_id,
            nom: otherUser.nom,
            prenom: otherUser.prenom,
            profile_image: otherUser.profile_image
          } : null
        };
      })
    );

    res.status(200).json({ 
      success: true, 
      data: conversationsWithUserDetails 
    });
  } catch (error) {
    console.error("Error getting user conversations:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a message
exports.deleteMessage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const message = await Messagerie.getById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Only sender or admin can delete
    if (message.id_expediteur !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Not authorized to delete this message" });
    }

    await Messagerie.delete(req.params.id);
    res.status(200).json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get unread messages count
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Messagerie.getUnreadCount(req.user.id);
    res.status(200).json({ success: true, data: { unread_count: count } });
  } catch (error) {
    console.error("Error getting unread count:", error);
    res.status(500).json({ message: "Server error" });
  }
};
