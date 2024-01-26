import auth from "../models/auth";

export const getUserProfile = async (req, res) => {
  try {
    const datas = await auth.findById(req.params.id);
    if (!datas) {
      return res.status(404).json({
        mes: "Thất bại thông tin khách hàng",
      });
    }
    return res.status(200).json({
      mes: "Lấy thành công thông tin thông khách hàng ",
      datas,
    });
  } catch (error) {
    return res.status(500).json({
      mes: error.mes,
    });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const datas = await auth.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!datas) {
      return res.status(404).json({
        mes: "failed update",
      });
    }
    return res.status(200).json({
      mes: "successful update ",
      datas,
    });
  } catch (error) {
    return res.status(500).json({
      datas: error.mes,
    });
  }
};
