import dotenv from "dotenv";
import ContactModel from "../models/contact";
import contactSchema from "../validation/contact";
import auth from "../models/auth";
import BillModel from "../models/bill";
dotenv.config();

export const getAllContact = async (req, res) => {
  try {
    // const { data } = await axios.get(`${API_URL}/ContactModel`);
    const data: any = await ContactModel.find();

    if (!data || data.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy liên hệ",
      });
    }

    const dataContact = await Promise.all(
      data.map(async (item: any) => {
        if (item?._doc.idNV != undefined) {
          const nhanVien: any = await auth.findById(item.idNV);
          if (item?._doc.idOrder != undefined) {
            const order = await BillModel.findById(item.idOrder);
            return {
              ...item?._doc,
              nhanVien: nhanVien,
              order: order,
            };
          }
          return {
            ...item?._doc,
            nhanVien: nhanVien,
          };
        }
        return item?._doc;
      })
    );

    return res.status(200).json({
      message: "Gọi danh sách liên hệ thành công!",
      datas: dataContact,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const getOneContact = async (req, res) => {
  try {
    const id = req.params.id;
    // const { data } = await axios.get(`${API_URL}/ContactModel/${id}`);
    const data = await ContactModel.findById(id);

    if (!data) {
      return res.status(404).json({
        message: "Không tìm thấy liên hệ",
      });
    }

    return res.status(200).json({
      message: "Gọi chi tiết liên hệ thành công!",
      datas: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const createContact = async (req, res) => {
  try {
    const body = req.body;
    const data = await ContactModel.create(body);
    console.log(data);
    const { error } = contactSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({
        message: errors,
      });
    }
    if (!data) {
      return res.status(404).json({
        message: "Tạo mới liên hệ thất bại!",
      });
    }

    return res.status(200).json({
      message: "Tạo mới liên hệ thành công!",
      datas: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const updateContact = async (req, res) => {
  try {
    const body = req.body;
    const id = req.params.id;
    // const { data } = await axios.put(`${API_URL}/ContactModel/${id}`, body);
    const data = await ContactModel.findByIdAndUpdate(id, body, { new: true });

    console.log(data);
    const { error } = contactSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({
        message: errors,
      });
    }
    if (!data) {
      return res.status(404).json({
        message: "Cập nhật liên hệ thất bại!",
      });
    }
    ///fygkyihhgj,hjmghgj
    return res.status(200).json({
      message: "Cập nhật liên hệ thành công!",
      datas: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const remoteContact = async (req, res) => {
  try {
    const id = req.params.id;
    // const { status } = await axios.delete(`${API_URL}/ContactModel/${id}`);
    const data = await ContactModel.findByIdAndDelete(id);

    console.log(data);
    if (!data) {
      return res.status(404).json({
        message: "Xoá liên hệ thất bại!",
      });
    }

    return res.status(200).json({
      message: "Xoá liên hệ thành công!",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Xoá liên hệ thất bại!",
    });
  }
};
export const setStaffWithContact = async (req, res) => {
  try {
    const idContacts = req.body.idContacts;
    const idNV = req.body.idNV;

    const contactData = await Promise.all(
      idContacts.map(async (idContact) => {
        const data = await ContactModel.findByIdAndUpdate(
          idContact,
          {
            idNV: idNV,
          },
          { new: true }
        );

        return data;
      })
    );

    return res.status(200).json({
      message: "Giao liên hệ cho Nhân viên thành công!",
      datas: contactData,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
