module.exports = {
	USER: {
		TOKEN_EXPIRE: {
			head: 'Thông báo',
			body: 'Phiên làm việc đã hết hoặc do người nào đó đã đăng nhập tài khoản của bạn ở thiết bị khác. Vui lòng đăng nhập lại. Xin cảm ơn.'
		},
		NOT_ALLOW_PUSH: {
			head: 'Thông báo',
			body: 'Không tìm thấy token để push cho User này'
		}
	},
	SYSTEM: {
		ERROR: {
			head: 'Thông báo',
			body: 'Hệ thống đang bận vui lòng thử lại'
		},
		WRONG_PARAMS: {
			head: 'Thông báo',
			body: 'Bạn vui lòng kiểm tra lại dữ liệu vừa nhập. Xin cảm ơn.'
		}
	},
	ORDER: {
		BLOCK_REJECT: {
			head: 'Thông báo',
			body: 'Bạn đã bị khoá tài khoản 15 phút vì huỷ bỏ đơn hệ thống, lần kế tiếp sẽ bị khoá lâu hơn bạn vui lòng kiểm tra kỹ thông tin đơn hàng trước khi bấm nhận. Săn Ship Team.'
		},
		FORCE_AUTHEN: {
			head: 'Thông báo',
			body: 'Loại đơn hàng này yêu cầu phải xác thực thông tin tài khoản. Bạn vui lòng chọn loại đơn hàng khác. Xin cảm ơn.'
		},
		MONEY_IS_NOMORE_VALID: {
			head: 'Thông báo',
			body: 'Đã có lỗi xảy ra trong quá trình tính phí Ship của đơn hàng này. Bạn vui lòng thoát app ra vào lại sau đó tạo đơn hàng. Xin cảm ơn.'
		},
		ORDER_EXPIRE: {
			head: 'Thông báo',
			body: 'Loại đơn hàng này đang không hoạt động vui lòng chọn loại đơn hàng khác. Xin cảm ơn.'
		},
		MISSING_PARAMS: {
			head: 'Thông báo',
			body: 'Bạn cần phải nhập số tiền Shipper nhận được. Xin cảm ơn!'
		},
		REJECT_SUCCESS: {
			head: 'Thông báo',
			body: 'Huỷ đơn hàng thành công, bạn có thể chỉnh sửa lại đơn hàng để tìm Shipper'
		},
		REJECT_SUCCESS_SHIPPER: {
			head: 'Thông báo',
			body: 'Huỷ nhận đơn hàng thành công'
		},
		RETRY_SUCCESS: {
			head: 'Thông báo',
			body: 'Tái kích hoạt tiến trình tìm kiếm Shipper thành công'
		},
		OTHER_TAKEN: {
			head: 'Thông báo',
			body: 'Đơn hàng đã được nhận bởi Shipper khác.'
		},
		HAS_NOTIFY_TAKE: {
			head: 'Thông báo',
			body: 'Bạn đã gửi thông báo cho Shipper rồi.'
		},
		NEED_AUTHEN: {
			head: 'Thông báo',
			body: 'Vì đơn hàng này không yêu cầu ứng tiền nên bạn cần phải xác thực tại văn phòng để nhận loại đơn hàng này. Xin cảm ơn.'
		}
	}
}
