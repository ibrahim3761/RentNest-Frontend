type IUser = {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    status: string;
    role: string;
    adress: string;
    phone: string;
    createdAt: string;
    updatedAt: string;
    avatarUrl?: string;
  };
};

export type NavbarProps = {
  user: IUser;
};
