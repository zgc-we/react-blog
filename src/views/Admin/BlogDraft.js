import React, { Component } from 'react';
import { Table, Divider, Tag } from 'antd';
import { connect } from 'react-redux'
import { Link } from 'dva/router'
import { deleteData } from '@/utils'

class BlogDraft extends Component {
    constructor() {
        super(...arguments)
        this.state = {
            columns: [
                {
                    title: 'Title',
                    dataIndex: 'title',
                    key: 'title',
                    // render: (text, record) => <Link to={`/blog/${record.key}`}>{text}</Link>,
                },
                {
                    title: 'Author',
                    dataIndex: 'author',
                    key: 'author',
                },
                {
                    title: 'Date',
                    dataIndex: 'date',
                    key: 'date',
                },
                {
                    title: 'Tags',
                    key: 'tags',
                    dataIndex: 'tags',
                    render: tags => (
                        <span>
                            {tags.map(tag => {
                                let color = tag.length > 5 ? 'geekblue' : 'green';
                                if (tag === 'loser') {
                                    color = 'volcano';
                                }
                                return (
                                    <Tag color={color} key={tag}>
                                        {tag.toUpperCase()}
                                    </Tag>
                                );
                            })}
                        </span>
                    ),
                },
                {
                    title: 'Action',
                    key: 'action',
                    render: (text, record) => (
                        <span>
                            <a>Edit {record.name}</a>
                            <Divider type="vertical" />
                            <a onClick={this.deleteBlog.bind(this, record.key)}>Delete</a>
                        </span>
                    ),
                },
            ],
            data: []
        }
    }
    deleteBlog = (key) => {
        console.log(key)
        deleteData({ data: { id: key } }, `/blog/${key}`)
        this.props.getBlogs({ method: 'get' })
    }

    componentDidMount () {
        this.props.getBlogs({ method: 'get' })
    }

    render () {
        const { blogs, user } = this.props.app
        const data = blogs.filter(item => item.author === user.email && item.status).map(item => {
            return {
                key: item._id,
                title: item.title,
                author: item.author,
                date: new Date(item.date).toLocaleDateString().replace(/\//g, '-'),
                tags: item.tags
            }
        })
        return (
            <div>
                <Table
                    columns={this.state.columns}
                    dataSource={data}
                    locale={{
                        emptyText: user.email ? '草稿箱里啥都没有嘞' : '登录之后才能查看自己的blog哦~'
                    }}
                />
            </div>
        )
    }
}

export default connect(
    ({ app }) => ({ app }),
    dispatch => ({
        getBlogs: payload => dispatch({ type: 'app/getBlogs', payload }),                    //获取博客数据
    })
)(BlogDraft)