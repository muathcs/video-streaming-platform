export type CelebType = {
  account: null;
  category: string;
  celebid: number;
  description: string;
  displayname: string;
  document: string;
  document_with_idx: string;
  email: string;
  followers: number;
  imgurl: string;
  price: number;
  request_num: number;
  reviews: number;
  uid: string;
  rating: number;
  username: string;
};

export type SocialMediaType = {
  name: string;
};

export type notification = {
  notificationid: number;
  message: string;
  is_read: boolean;
  intended_uid: string;
  sender_uid: string;
};

// types.ts
export type RequestType = {
  message: string;
  reqtype: string;
  celebUid: string;
  fanUid: string;
  reqaction: string;
  timestamp1: string;
  reqstatus: string;
  celebmessage: string;
  requestid: string;
  tosomeoneelse: boolean;
  fromperson: string;
  toPerson: string;
  price: number;
};

export type UserInfoType = {
  fanid: string;
  email: string;
  displayname: string;
  total_spent: number;
  fav_categories: string;
  num_of_requests: number;
  uid: string;
  imgurl: string;
  description: string;
  created_at: Date;
};

// for the AuthContext.tsx file, handles the export of the useAuth function
export type AuthContextType = {
  currentUser: any;
  resetPassword: (email: string) => void;
  token: string;
  signup: (email: string, password: string, username: string) => any;
  login: (email: string, password: string) => any;
  logout: () => void;
  reauthenticateUser: (
    password: string
  ) => Promise<{ state: boolean; message: any } | undefined>;
  uploadProfilePic: (imgurl: string, user: any) => void;
  celeb: boolean | undefined;
  userInfo: UserInfoType | undefined;
};

export type ReviewsType = {
  Date: Date;
  celebCelebid: string;
  event: string;
  message: string;
  reviewed_id: string;
  reviewer_id: string;
  rating: number;
  reviewer_name: string;
  reviewid: string;
};
