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
  reqaction: string;
  timestamp1: string;
  reqstatus: string;
  celebmessage: string;
  requestid: string;
};

// celeb t
