"use client";

import { createContext, useContext, useState, useEffect } from "react";

const SettingsContext = createContext();

export const translations = {
  en: {
    settings: "Settings",
    language: "Language",
    theme: "Theme",
    arabic: "Arabic",
    english: "English",
    light: "Light",
    dark: "Dark",
    accentColor: "Accent Color",
    saveChanges: "Save Changes",
    profile: "Profile",
    feed: "Feed",
    friends: "Friends",
    search: "Search",
    notifications: "Notifications",
    createPost: "Create Post",
    suggestedFriends: "Suggested Friends",
    logout: "Logout",
    loggedInAs: "Logged in as",
    loading: "Loading...",
    yourFeed: "Your Feed",
    seeWhatFriendsAreUpTo: "See what your friends are up to",
    follow: "Follow",
    mutualFriends: "Mutual Friends",
    newToBackBook: "New to BackBook",
    peopleYouMayKnow: "People you may know",
    yourFriends: "Your Friends",
    manageConnections: "Manage your connections and find new people",
    allFriends: "All Friends",
    requests: "Requests",
    discover: "Discover",
    addFriend: "Add Friend",
    searchFriends: "Search friends...",
    noFriendsYet: "No friends yet",
    startSearching: "Start searching for people to connect with!",
    failedToLoadFriends: "Failed to load friends. Please try again later.",
    activeRecently: "Active recently",
    readMore: "Read More",
    love: "Love",
    think: "Think",
    share: "Share",
    discoverPeople: "Discover People",
    findNewFriends: "Find new friends and grow your community",
    searchUsers: "Search users...",
    noUsersFound: "No users found",
    noMoreDiscover: "No more people to discover",
    requestSent: "Request Sent",
    pendingInvites: "Pending Invites",
    acceptOrDecline:
      "Accept or decline requests from people who want to connect with you.",
    accept: "Accept",
    decline: "Decline",
    confirm: "Confirm",
    delete: "Delete",
    sentRequest: "Sent you a friend request",
    noPendingRequests: "No pending requests",
    // AddPost & EditPost
    expressYourself: "Express yourself to the world",
    headline: "Headline",
    story: "Story",
    givePostTitle: "Give your post a title...",
    whatsHappening: "What's happening?",
    addMedia: "Add Media",
    publishPost: "Publish Post",
    publishing: "Publishing...",
    liveEditor: "Live Editor",
    editPost: "Edit Post",
    refineThoughts: "Refine your thoughts",
    postTitle: "Post Title",
    content: "Content",
    whatsOnYourMind: "What's on your mind?",
    updateImages: "Update Images",
    newImage: "New Image",
    addPhotos: "Add Photos",
    cancel: "Cancel",
    // Delete Modal
    deleteConfirm: "Delete post?",
    deleteWarning:
      "This action cannot be undone. This post will be permanently removed from your profile and the feed.",
    yesDelete: "Yes, Delete",
    // Post Detail
    postNotFound: "Post not found",
    errorLoadingPost: "Error loading post",
    writeComment: "Write a comment...",
    send: "Send",
    // Toast messages
    postCreated: "Post created successfully!",
    titleAndContentRequired: "Please provide both a title and content",
    somethingWentWrong: "Something went wrong",
    failedToConnect: "Failed to connect to the server",
    maxImages: "You can only upload up to 10 images",
  },
  ar: {
    settings: "الإعدادات",
    language: "اللغة",
    theme: "المظهر",
    arabic: "العربية",
    english: "الإنجليزية",
    light: "فاتح",
    dark: "داكن",
    accentColor: "لون التمييز",
    saveChanges: "حفظ التغييرات",
    profile: "الملف الشخصي",
    feed: "الرئيسية",
    friends: "الأصدقاء",
    search: "بحث",
    notifications: "الإشعارات",
    createPost: "إنشاء منشور",
    suggestedFriends: "أصدقاء مقترحون",
    logout: "تسجيل الخروج",
    loggedInAs: "مسجل الدخول باسم",
    loading: "جاري التحميل...",
    yourFeed: "خلاصتك",
    seeWhatFriendsAreUpTo: "شاهد ماذا يفعل أصدقاؤك",
    follow: "متابعة",
    mutualFriends: "أصدقاء مشتركون",
    newToBackBook: "جديد في BackBook",
    peopleYouMayKnow: "أشخاص قد تعرفهم",
    yourFriends: "أصدقاؤك",
    manageConnections: "إدارة اتصالاتك والعثور على أشخاص جدد",
    allFriends: "كل الأصدقاء",
    requests: "الطلبات",
    discover: "اكتشف",
    addFriend: "إضافة صديق",
    searchFriends: "البحث عن أصدقاء...",
    noFriendsYet: "لا يوجد أصدقاء بعد",
    startSearching: "ابدأ البحث عن أشخاص للتواصل معهم!",
    failedToLoadFriends: "فشل تحميل الأصدقاء. يرجى المحاولة مرة أخرى لاحقاً.",
    activeRecently: "نشط مؤخراً",
    readMore: "اقرأ المزيد",
    love: "أعجبني",
    think: "فكر",
    share: "مشاركة",
    discoverPeople: "اكتشف أشخاصاً",
    findNewFriends: "اعثر على أصدقاء جدد وقم بتوسيع مجتمعك",
    searchUsers: "البحث عن مستخدمين...",
    noUsersFound: "لم يتم العثور على مستخدمين",
    noMoreDiscover: "لا يوجد مزيد من الأشخاص لكتشافهم",
    requestSent: "تم إرسال الطلب",
    pendingInvites: "دعوات معلقة",
    acceptOrDecline:
      "قبول أو رفض الطلبات من الأشخاص الذين يرغبون في التواصل معك.",
    accept: "قبول",
    decline: "رفض",
    confirm: "تأكيد",
    delete: "حذف",
    sentRequest: "أرسل لك طلب صداقة",
    noPendingRequests: "لا توجد طلبات معلقة",
    // AddPost & EditPost
    expressYourself: "عبّر عن نفسك للعالم",
    headline: "العنوان",
    story: "القصة",
    givePostTitle: "أعط منشورك عنواناً...",
    whatsHappening: "ماذا يحدث؟",
    addMedia: "إضافة وسائط",
    publishPost: "نشر المنشور",
    publishing: "جاري النشر...",
    liveEditor: "محرر مباشر",
    editPost: "تعديل المنشور",
    refineThoughts: "حسّن أفكارك",
    postTitle: "عنوان المنشور",
    content: "المحتوى",
    whatsOnYourMind: "بماذا تفكر؟",
    updateImages: "تحديث الصور",
    newImage: "صورة جديدة",
    addPhotos: "إضافة صور",
    cancel: "إلغاء",
    // Delete Modal
    deleteConfirm: "حذف المنشور؟",
    deleteWarning:
      "لا يمكن التراجع عن هذا الإجراء. سيتم حذف هذا المنشور نهائياً من ملفك الشخصي والخلاصة.",
    yesDelete: "نعم، احذف",
    // Post Detail
    postNotFound: "المنشور غير موجود",
    errorLoadingPost: "خطأ في تحميل المنشور",
    writeComment: "اكتب تعليقاً...",
    send: "إرسال",
    // Toast messages
    postCreated: "تم إنشاء المنشور بنجاح!",
    titleAndContentRequired: "يرجى إدخال العنوان والمحتوى",
    somethingWentWrong: "حدث خطأ ما",
    failedToConnect: "فشل الاتصال بالخادم",
    maxImages: "يمكنك رفع 10 صور كحد أقصى",
  },
};

export function SettingsProvider({ children }) {
  const [language, setLanguage] = useState("en");
  const [theme, setTheme] = useState("light");
  const [accent, setAccent] = useState("indigo");

  useEffect(() => {
    // Load from localStorage
    const savedLang = localStorage.getItem("language") || "en";
    const savedTheme = localStorage.getItem("theme") || "light";
    const savedAccent = localStorage.getItem("accent") || "indigo";

    setLanguage(savedLang);
    setTheme(savedTheme);
    setAccent(savedAccent);

    // Apply initial settings
    document.documentElement.lang = savedLang;
    document.documentElement.dir = savedLang === "ar" ? "rtl" : "ltr";

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    document.documentElement.setAttribute("data-accent", savedAccent);
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  };

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const changeAccent = (newAccent) => {
    setAccent(newAccent);
    localStorage.setItem("accent", newAccent);
    document.documentElement.setAttribute("data-accent", newAccent);
  };

  const t = translations[language];

  return (
    <SettingsContext.Provider
      value={{
        language,
        changeLanguage,
        theme,
        changeTheme,
        accent,
        changeAccent,
        t,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
