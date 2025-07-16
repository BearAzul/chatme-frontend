import { create } from "zustand";
import toast from "react-hot-toast";
import axiosInstanace from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore.js";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  notifications: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstanace.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstanace.get(`/messages/${userId}`);
      set({ messages: res.data });
      get().removeNotification(userId);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstanace.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("newMessage");

    socket.on("newMessage", (newMessage) => {
      const { selectedUser, messages } = get();

      if (selectedUser?._id === newMessage.senderId) {
        set({ messages: [...messages, newMessage] });
      } else {
        get().addNotification(newMessage.senderId);
        toast.success(`Pesan baru dari pengguna lain!`);
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => {
    set({ selectedUser });
    get().getMessages(selectedUser._id);
  },

  addNotification: (senderId) => {
    set((state) => {
      if (!state.notifications.includes(senderId)) {
        return { notifications: [...state.notifications, senderId] };
      }
      return {};
    });
  },

  removeNotification: (senderId) => {
    set((state) => ({
      notifications: state.notifications.filter((id) => id !== senderId),
    }));
  },
}));
