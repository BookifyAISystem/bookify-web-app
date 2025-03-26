const menu = [
    {
      id: 1,
      title: "Dashboard",
      listItems: [
        {
          id: 1,
          title: "Trang chủ",
          url: "/admin",
          icon: "/home.svg",
        },
        // {
        //   id: 2,
        //   title: "Thông tin cá nhân",
        //   url: "/admin/users/1",
        //   icon: "/user.svg",
        // },
      ],
    },
    {
      id: 2,
      title: "Danh sách",
      listItems: [
        {
          id: 1,
          title: "Người dùng",
          url: "/admin/users",
          icon: "/user.svg",
        },
        {
          id: 2,
          title: "Kho sách",
          url: "/admin/books",
          icon: "/product.svg",
        },
        {
          id: 3,
          title: "Đơn hàng",
          url: "/admin/orders",
          icon: "/order.svg",
        },
        {
          id: 4,
          title: "Vai trò",
          url: "/admin/roles",
          icon: "/setting.svg",
        },
        {
          id: 5,
          title: "Bài đăng",
          url: "/not-developed",
          icon: "/post2.svg",
        },
      ],
    },
    {
      id: 3,
      title: "Tổng quan",
      listItems: [
        // {
        //   id: 1,
        //   title: "Elements",
        //   url: "/",
        //   icon: "/element.svg",
        // },
        {
          id: 2,
          title: "Ghi chú",
          url: "/admin/notes",
          icon: "/note.svg",
        },
        // {
        //   id: 3,
        //   title: "Forms",
        //   url: "/",
        //   icon: "/form.svg",
        // },
        {
          id: 4,
          title: "Lịch",
          url: "/not-developed",
          icon: "/calendar.svg",
        },
      ],
    },
    {
      id: 4,
      title: "Bảo trì",
      listItems: [
        {
          id: 1,
          title: "Cài đặt",
          url: "/not-developed",
          icon: "/setting.svg",
        },
        {
          id: 2,
          title: "Backups",
          url: "/not-developed",
          icon: "/backup.svg",
        },
      ],
    },
    // {
    //   id: 5,
    //   title: "analytics",
    //   listItems: [
    //     {
    //       id: 1,
    //       title: "Charts",
    //       url: "/",
    //       icon: "/chart.svg",
    //     },
    //     {
    //       id: 2,
    //       title: "Logs",
    //       url: "/",
    //       icon: "/log.svg",
    //     },
    //   ],
    // },
  ];
  
export default menu;