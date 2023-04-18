import React from "react";

type Props = {};

const Profile = (props: Props) => {
  return (
    <div>
      <header>
        <h1>欢迎来到个人页</h1>
      </header>
      <main>
        <section>
          <h2>您还未登录</h2>
          <p>请登录以查看您的个人资料和其他功能</p>
          <button>登录</button>
          <button>注册</button>
        </section>

        <section>
          <h2>开通会员</h2>
          <p>开通会员，享受无限对话体验</p>
          <button>开通会员无限对话</button>
        </section>
      </main>
    </div>
  );
};

export default Profile;
