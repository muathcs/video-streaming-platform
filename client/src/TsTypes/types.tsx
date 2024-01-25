export interface CelebType {
  displayname: string;
  username: string;
  category: string;
  reviews: number;
  price: number;
  description: string;
  imgurl: string;
  uid: string;
}

export type notification = {
  notificationid: number;
  message: string;
  is_read: boolean;
  intended_uid: string;
  sender_uid: string;
};

export type Request = {
  message: string;
  reqtype: string;
  reqaction: string;
  timestamp1: string;
  reqstatus: string;
  celebmessage: string;
  requestid: string;
};
