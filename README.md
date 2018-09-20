# Content Factory 内容工厂

## 概念
我们从传统的单一CMS（内容管理系统）解决方案中，提出一个新的解决方案，我们称之为“内容工厂”。在这个新的数字应用环境中，内容不再仅仅展现于单个web页面上，而是同一内容块可以在多个设备的多个应用程序中重新定位。它可以进行编辑、本地化或优化，以适应各种屏幕大小和客户应用端。此外，还能够根据客户相关的内容需要不断的更新，以保持内容的鲜活，且当数字业务扩展时每一个内容都将更加有用，而不是为团队增加更多的压力与投入。

## 技术

## 模块

## 使用
### 类型创建

- 示例
```graphql
mutation{
  saveEntrytype(entrytype:{
    name: "Author"
    fields:[
      {
        name:"name"
        title: "人物名称"
        type:SHORT_TEXT
      },
      {
        name:"title"
        title:"人物标题"
        type:SHORT_TEXT
      },
      {
        name: "company"
        title: "所在公司"
        type: SHORT_TEXT
      },
      {
        name: "short bio"
        title: "简历"
        type:LONG_TEXT
      },
      {
        name: "email"
        title: "邮箱"
        type:SHORT_TEXT
        validations:[{
          regexp:{
            pattern:"^\/w[\/w.-]*@([\/w-]+\/.)+[\/w-]+$"
          }
        }]
      },
      {
        name:"phone"
        title:"手机"
        type:SHORT_TEXT
        validations:[{
          regexp:{
            pattern:"\/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\\d{8}$"
          }
        }]
      },
      {
        name:"github"
        title: "Github"
        type:SHORT_TEXT
      },
      {
      	name:"weibo"
        title: "Weibo"
        type:SHORT_TEXT
      },
      {
        name: "avatar"
        title: "头像"
        type:MEDIA
      }
    ]
  }){
    fields{
      title
    }
  }
}
```
### 从源码构建

我们使用并推荐使用 Yarn

### GraphQL 客户端工具


