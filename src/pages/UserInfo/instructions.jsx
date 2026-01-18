import React, { useEffect, useState } from 'react';
import aideveloping from '../../assets/video/aideveloping.mov';
import aipro from '../../assets/video/AIpro.mov';
export default function Instruction() {
  const [xemXong, setXemXong] = useState(false);
  const [typeoftest, settypeoftest] = useState(0);
  const typeAIPro = `
    <p>Ch&agrave;o mừng bạn đ&atilde; tham gia dự &aacute;n <strong>Đo lường khả năng tư duy phản biện của Sinh vi&ecirc;n Việt Nam</strong>.</p>
<p><span style="font-weight: 400;">Ngay sau đ&acirc;y, bạn sẽ được mời thực hiện một b&agrave;i kiểm tra trắc nghiệm chuy&ecirc;n s&acirc;u được chọn lọc kỹ lưỡng từ c&aacute;c tổ chức kiểm định thế giới (GMAT). Th&ocirc;ng qua b&agrave;i kiểm tra, bạn sẽ được trải nghiệm </span><strong>AI t&iacute;ch hợp m&ocirc; h&igrave;nh Gemini Pro 3 </strong><span style="font-weight: 400;">- bản cập nhật Gemini mới nhất vừa được ph&aacute;t h&agrave;nh bởi Google.</span></p>
<p><br /> <span style="text-decoration: underline;"><strong>TH&Ocirc;NG TIN CỤ THỂ:</strong></span></p>
<p>- Số lượng:&nbsp;<strong> 10 C&acirc;u hỏi trắc nghiệm</strong></p>
<p>- Thời gian ho&agrave;n th&agrave;nh: <strong>Kh&ocirc;ng giới hạn</strong></p>
<p>- Vui l&ograve;ng <span style="color: #ff0000;"><strong>KH&Ocirc;NG</strong></span> chuyển cửa sổ hoặc tho&aacute;t khỏi tr&igrave;nh duyệt v&igrave; sẽ l&agrave;m hỏng kết quả.</p>
<p>- Bạn <strong>ĐƯỢC PH&Eacute;P</strong> sử dụng <strong>Gemini Pro 3</strong> đ&atilde; được t&iacute;ch hợp k&egrave;m để hỗ trợ c&acirc;u hỏi trong qu&aacute; tr&igrave;nh thực hiện b&agrave;i kiểm tra.</p>
  `;
  const typedevelopingAI = `
    <p>Ch&agrave;o mừng bạn đ&atilde; tham gia dự &aacute;n <strong>Đo lường khả năng tư duy phản biện của Sinh vi&ecirc;n Việt Nam</strong>.</p>
<p><span style="font-weight: 400;">Ngay sau đ&acirc;y, bạn sẽ được mời thực hiện một b&agrave;i kiểm tra trắc nghiệm chuy&ecirc;n s&acirc;u được chọn lọc kỹ lưỡng từ c&aacute;c tổ chức kiểm định thế giới (GMAT). Th&ocirc;ng qua b&agrave;i kiểm tra, bạn sẽ được trải nghiệm một </span><strong>c&ocirc;ng cụ AI ho&agrave;n to&agrave;n mới vừa được ph&aacute;t triển lần đầu tại Việt Nam</strong><span style="font-weight: 400;">.</span></p>
<p><br /> <span style="text-decoration: underline;"><strong>TH&Ocirc;NG TIN CỤ THỂ:</strong></span></p>
<p>- Số lượng:&nbsp;<strong>10 c&acirc;u hỏi trắc nghiệm</strong></p>
<p>- Thời gian ho&agrave;n th&agrave;nh:&nbsp;<strong>Kh&ocirc;ng giới hạn</strong></p>
<p>- Vui l&ograve;ng <span style="color: #ff0000;"><strong>KH&Ocirc;NG</strong></span> chuyển cửa sổ hoặc tho&aacute;t khỏi tr&igrave;nh duyệt v&igrave; sẽ l&agrave;m hỏng kết quả.</p>
<p>- <span style="font-weight: 400;">Bạn </span><strong>ĐƯỢC PH&Eacute;P sử dụng phần mềm AI</strong><span style="font-weight: 400;"> được t&iacute;ch hợp k&egrave;m để hỗ trợ trả lời c&acirc;u hỏi trong qu&aacute; tr&igrave;nh thực hiện b&agrave;i kiểm tra.</span></p>
<p>&nbsp;</p>
<p><span style="text-decoration: underline;"><strong>LƯU &Yacute;:</strong></span></p>
<p>- <strong>C&ocirc;ng cụ AI được trang bị sẳn AI hiện vẫn <span style="color: #ff0000;">đang trong qu&aacute; tr&igrave;nh thử nghiệm n&ecirc;n c&oacute; thể mắc lỗi sai</span>,&nbsp;</strong>vui l&ograve;ng kiểm tra lại đ&aacute;p &aacute;n trước khi nộp b&agrave;i.</p>
<p>- Kết quả b&agrave;i l&agrave;m sẽ được bảo mật v&agrave; chỉ được sử dụng nhằm mục đ&iacute;ch ph&aacute;t triển phần mềm AI.</p>
  `;
  const instruction = `
  <p style="text-align: center;">---------------------------------------------------------------------------------------------------</p>
<p><span style="text-decoration: underline;"><strong>Dưới đ&acirc;y l&agrave; c&acirc;u hỏi mẫu</strong><strong>:</strong></span></p>
<p><span style="font-weight: 400;">Để b&aacute;n d&ograve;ng xe m&aacute;y điện mới (gi&aacute; 40 triệu VNĐ), nh&oacute;m Marketing đề xuất thu&ecirc; Sơn T&ugrave;ng M-TP l&agrave;m đại sứ v&igrave; anh c&oacute; lượng fan đ&ocirc;ng đảo nhất mạng x&atilde; hội.</span></p>
<p><span style="font-weight: 400;">Kế hoạch n&agrave;y sẽ thất bại nếu điều n&agrave;o sau đ&acirc;y l&agrave; sự thật?</span></p>
<p><strong>C&aacute;c phương &aacute;n lựa chọn:</strong></p>
<p><strong><span style="font-weight: 400;">&nbsp; &nbsp; &nbsp;(A) Đối thủ cạnh tranh c&oacute; c&ocirc;ng nghệ pin tốt hơn.</span></strong></p>
<p>&nbsp; &nbsp; &nbsp;(B) Fan của Sơn T&ugrave;ng chủ yếu l&agrave; học sinh, sinh vi&ecirc;n chưa tự chủ t&agrave;i ch&iacute;nh.</p>
<p>&nbsp; &nbsp; &nbsp;(C) Sơn T&ugrave;ng từng đại diện cho c&aacute;c nh&atilde;n h&agrave;ng b&igrave;nh d&acirc;n.</p>
<p>&nbsp; &nbsp; &nbsp;(D) Gi&aacute; xăng dầu đang c&oacute; xu hướng tăng cao.</p>
<p>&nbsp; &nbsp; &nbsp;(E) Kh&aacute;ch h&agrave;ng mục ti&ecirc;u ưu ti&ecirc;n th&ocirc;ng số kỹ thuật hơn l&agrave; người đại diện.</p>
<p>&nbsp; &nbsp; &nbsp;(F) T&ocirc;i kh&ocirc;ng thực sự hiểu c&acirc;u hỏi, khi d&ugrave;ng AI th&igrave; cảm thấy c&acirc;u trả lời của AI kh&ocirc;ng hợp l&yacute;</p>
<p><strong>&rarr; Đ&aacute;p &aacute;n đ&uacute;ng: B</strong></p>`;

  useEffect(() => {
    const tokenRaw = localStorage.getItem('token');
    const typeTest = tokenRaw ? JSON.parse(tokenRaw)?.[0]?.typeoftest : null;

    settypeoftest(typeTest);
  }, []);
  const nextPage = () => {
    window.location.href = '/';
  };
  return (
    /* 🌈 BACKGROUND GRADIENT */

    <div
      className="
        min-h-screen w-full
        bg-gradient-to-br
        from-slate-50
        via-cyan-50
        to-emerald-50
        flex flex-col
        px-4 py-10
        items-center
        
      "
    >
      {/* ===== PROJECT TITLE (OUTSIDE GLASS BLOCK) ===== */}
      <div className="max-w-5xl text-center mb-8">
        <h1
          className="
      text-2xl md:text-3xl lg:text-4xl
      font-semibold
      tracking-wide
      text-transparent
      bg-clip-text
      bg-gradient-to-r
      from-slate-700
      via-cyan-600
      to-emerald-600
    "
        >
          DỰ ÁN “ĐO LƯỜNG KHẢ NĂNG TƯ DUY PHẢN BIỆN CỦA SINH VIÊN VIỆT NAM TRONG MÔI TRƯỜNG CÓ SỰ HỖ
          TRỢ TỪ CÔNG CỤ AI”
        </h1>

        <p className="mt-3 text-sm md:text-base text-slate-500">
          Human–AI Trust & Critical Thinking Evaluation Platform
        </p>

        <div className="mt-4 flex justify-center">
          <span className="px-4 py-1 text-xs rounded-full bg-cyan-500/10 text-cyan-700">
            Academic · AI-assisted · Confidential Research
          </span>
        </div>
      </div>
      {/* 🧊 GLASS CARD */}
      <div
        className="
          max-w-4xl w-full
          rounded-2xl
          border border-slate-200/60
          bg-white/60
          backdrop-blur-xl
          shadow-xl
          p-8
        "
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-600 text-xl">
            🤖
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-800">AI Evaluation Instruction</h2>
            <p className="text-sm text-slate-500">Human–AI Trust Measurement Platform</p>
          </div>
        </div>

        {/* Content */}

        <div className="space-y-6">
          {/* Video hướng dẫn */}
          <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200">
            <video className="w-full" controls onEnded={() => setXemXong(true)}>
              {typeoftest === 0 ? <source src={aipro} /> : <source src={aideveloping} />}
              {/* <source src={aideveloping} /> */}
              Trình duyệt của bạn không hỗ trợ video.
            </video>
          </div>

          {/* Thông báo */}
          {!xemXong && (
            <div
              className="
  mt-4
  flex
  items-center
  gap-2
  rounded-lg
  border
  border-blue-200
  bg-blue-50
  px-4
  py-3
  text-sm
  sm:text-base
  text-blue-700
  font-medium
"
            >
              👉 <span>Vui lòng xem hết video để tiếp tục làm bài</span>
            </div>
          )}
        </div>
        {/* <div
          className="
            prose prose-slate max-w-none
            text-slate-700 text-sm leading-relaxed
          "
          dangerouslySetInnerHTML={{
            __html: typeoftest === 0 ? typeAIPro : typedevelopingAI,
          }}
        /> */}
        {/* <div
          className="
            prose prose-slate max-w-none
            text-slate-700 text-sm leading-relaxed
          "
          dangerouslySetInnerHTML={{
            __html: instruction,
          }}
        /> */}
        {/* Footer */}
        <div className="mt-8 flex items-center justify-between">
          <span className="text-xs text-slate-400">© AI Research Platform</span>

          <span className="px-3 py-1 text-xs rounded-full bg-emerald-500/10 text-emerald-700">
            Secure · Confidential
          </span>
        </div>
      </div>
      <div className="mt-10 flex justify-end w-full max-w-4xl">
        <button
          disabled={!xemXong}
          onClick={nextPage}
          className={`
    flex items-center gap-2
    px-6 py-3
    rounded-xl
    text-white font-medium
    shadow-lg
    transition-all duration-300

    ${
      xemXong
        ? `
          bg-gradient-to-r from-emerald-500 to-cyan-500
          hover:from-emerald-600 hover:to-cyan-600
          hover:shadow-xl
          active:scale-95
          cursor-pointer
        `
        : `
          bg-gray-300
          text-gray-500
          shadow-none
          cursor-not-allowed
          opacity-60
        `
    }
  `}
        >
          📋 Bắt đầu làm bài
          <span className="text-lg">→</span>
        </button>
      </div>
    </div>
  );
}
