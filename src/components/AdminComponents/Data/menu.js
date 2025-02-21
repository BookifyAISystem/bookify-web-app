const menu = [
    {
      id: 1,
      title: "main",
      listItems: [
        {
          id: 1,
          title: "Homepage",
          url: "/admin",
          icon: "/home.svg",
        },
        {
          id: 2,
          title: "Profile",
          url: "/admin/users/1",
          icon: "/user.svg",
        },
      ],
    },
    {
      id: 2,
      title: "lists",
      listItems: [
        {
          id: 1,
          title: "Users",
          url: "/admin/users",
          icon: "/user.svg",
        },
        {
          id: 2,
          title: "Books",
          url: "/admin/books",
          icon: "/product.svg",
        },
        {
          id: 3,
          title: "Orders",
          url: "/admin/orders",
          icon: "/order.svg",
        },
        {
          id: 4,
          title: "Roles",
          url: "/admin/roles",
          icon: "/setting.svg",
        },
        {
          id: 5,
          title: "Posts",
          url: "/admin/posts",
          icon: "/post2.svg",
        },
      ],
    },
    {
      id: 3,
      title: "general",
      listItems: [
        // {
        //   id: 1,
        //   title: "Elements",
        //   url: "/",
        //   icon: "/element.svg",
        // },
        {
          id: 2,
          title: "Notes",
          url: "/",
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
          title: "Calendar",
          url: "/",
          icon: "/calendar.svg",
        },
      ],
    },
    {
      id: 4,
      title: "Maintenance",
      listItems: [
        {
          id: 1,
          title: "Settings",
          url: "/",
          icon: "/setting.svg",
        },
        {
          id: 2,
          title: "Backups",
          url: "/",
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