export const checkActive = (status: string) => {
  switch (status) {
    case "UnAvailable":
      return 1;
    case "Available":
      return 0;
    case "Not Start":
      return 0;
    case "On Going":
      return 0;
    case "Expired":
      return 2;
    case "OutOfService":
      return 1;
    case "Occupied":
      return 0;
    case "Reserved":
      return 0;
    case "Cleaning":
      return 0;
    default:
      return 2;
  }
};
export const checkShowEdit = (status: string) => {
  switch (status) {
    case "UnAvailable":
      return false;
    case "Available":
      return true;
    case "Not Start":
      return true;
    case "On Going":
      return true;
    case "Expired":
      return false;
    case "OutOfService":
      return false;
    case "Occupied":
      return false;
    case "Reserved":
      return true;
    case "Cleaning":
      return true;
    default:
      return false;
  }
};

export const checkCanEdit = (status: string) => {
  switch (status) {
    case "UnAvailable":
      return 0;
    case "Not Start":
      return 2;
    case "On Going":
      return 1;
    case "Expired":
      return 0;
    default:
      return 0;
  }
};

export const checkShowDelete = (status: string) => {
  switch (status) {
    case "UnAvailable":
      return true;
    case "Available":
      return true;
    case "Not Start":
      return true;
    case "On Going":
      return false;
    case "Expired":
      return true;
    case "OutOfService":
      return true;
    case "Occupied":
      return false;
    case "Reserved":
      return true;
    case "Cleaning":
      return true;
    default:
      return true;
  }
};
