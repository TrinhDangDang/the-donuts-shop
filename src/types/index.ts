export interface MenuItem {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
}

export interface User {
  _id: string;
  userName: string;
  email: string;
  DoB?: Date;
  password: string;
  points: number;
}
