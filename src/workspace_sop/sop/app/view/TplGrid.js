/**
 * テンプレートグリッド
 */
Ext.define(
    "sop.view.TplGrid", {
        extend: 'Ext.grid.Panel',
        xtype: 'tpl-grid',

        store: 'TplStore',
        selModel: {
            selType: 'rowmodel'
        },

        columns: [{
            xtype: 'rownumberer'
        }, {
            dataIndex: 'pj_name',
            text: 'Project Name', // プロジェクト名
            hidden: true
        }, {
            dataIndex: 'sop_name',
            text: 'SOP',
            width: 180
        }, {
            dataIndex: 'sop_name_en',
            text: 'sop_name_en',
            hidden: true
        }, {
            dataIndex: 'tpl_id',
            text: 'ID',
            hidden: true
        }, {
            dataIndex: 'tpl_name',
            text: 'Version', // バージョン
            width: 110
        }, {
            dataIndex: 'revision_no',
            text: 'revision_no',
            hidden: true
        }, {
            dataIndex: 'latest_flg',
            text: 'Latest', // 
            width: 80,
            xtype: 'templatecolumn',
            tpl: '<tpl if="latest_flg==1">YES<tpl else>NO</tpl>'
        }, {
            dataIndex: 'aprv_flg',
            text: 'Status', // 
            width: 140,
            xtype: 'templatecolumn',
            tpl: '<tpl if="aprv_flg==0">Require Approval<tpl elseif="aprv_flg==1">Accepted<tpl elseif="aprv_flg==2"><span style="color:#FF0000;">Send Back</span><tpl elseif="aprv_flg==4">Edit Input Form</tpl>' // <tpl if="aprv_flg==0">承認待ち<tpl elseif="aprv_flg==1">承認済<tpl elseif="aprv_flg==2"><span style="color:#FF0000;">差戻し</span><tpl elseif="aprv_flg==4">入力フ>ォーム設定中</tpl> 
        }, {
            dataIndex: 'upld_user',
            text: 'Registrar', // 登録者
            width: 110
        }, {
            dataIndex: 'upld_date',
            text: 'Registration Date', // 登録日時
            width: 160,
            xtype: 'datecolumn',
            format: 'Y/m/d H:i:s'
        }, {
            dataIndex: 'upld_cmnt',
            text: 'Registration Comment', // 登録コメント
            hidden: true
        }, {
            dataIndex: 'rtn_user',
            text: 'Send Back Director', // 差戻し者
            width: 110
        }, {
            dataIndex: 'rtn_date',
            text: 'Send Back Date', // 差戻し日時
            width: 160,
            xtype: 'datecolumn',
            format: 'Y/m/d H:i:s'
        }, {
            dataIndex: 'rtn_cmnt',
            text: 'Send Back Comment', // 差戻しコメント
            hidden: true
        }, {
            dataIndex: 'aprv_user',
            text: 'Approval Supervisor', // 承認者
            width: 110
        }, {
            dataIndex: 'aprv_date',
            text: 'Acceptable Date', // 承認日時
            width: 160,
            xtype: 'datecolumn',
            format: 'Y/m/d H:i:s'
        }, {
            dataIndex: 'aprv_cmnt',
            text: 'Acceptable Comment', // 承認コメント
            hidden: true
        }],
        features: [{
            ftype: 'filters',
            filters: [{
                type: 'string',
                dataIndex: 'pj_name'
            }, {
                type: 'string',
                dataIndex: 'sop_name'
            }, {
                type: 'string',
                dataIndex: 'tpl_name'
            }, {
                type: 'list',
                dataIndex: 'latest_flg',
                options: [
                    [1, 'YES'],
                    [0, 'NO']
                ],
                phpMode: true
            }, {
                type: 'list',
                dataIndex: 'aprv_flg',
                options: [
                    [4, 'Edit Input Form'], // 入力フォーム設定中
                    [0, 'Require Approval'], // 承認待ち
                    [1, 'Accepted'], // 承認済
                    [2, 'Send Back'] // 差戻し
                ],
                phpMode: true
            }, {
                type: 'date',
                dataIndex: 'upld_date',
                dateFormat: 'Y/m/d'
            }, {
                type: 'date',
                dataIndex: 'aprv_date',
                dateFormat: 'Y/m/d'
            }, {
                type: 'date',
                dataIndex: 'rtn_date',
                dateFormat: 'Y/m/d'
            }]
        }],

        bbar: [{
            xtype: 'pagingtoolbar',
            store: 'TplStore',
            displayInfo: true
        }],

        initComponent: function() {
            this.menu = this.buildMenu();
            this.callParent();
            this.on({
                scope: this,
                itemcontextmenu: this.onItemContextMenu
            });
        },

        buildMenu: function() {
            return Ext.create(
                'Ext.menu.Menu', {
                    itemId: 'tpl_grid_menu',
                    items: [{
                        itemId: 'tpl_dtl_menu',
                        iconCls: 'icon-detail',
                        text: 'Show Detail' // 詳細閲覧 
                    }, {
                        itemId: 'tpl_dtl_edit_menu',
                        iconCls: 'icon-upd',
                        text: 'Edit' // 編集
                    }, {
                        itemId: 'tpl_prev_menu',
                        iconCls: 'icon-prev',
                        text: 'Preview' // プレビュー
                    }, {
                        itemId: 'tpl_edit_menu',
                        iconCls: 'icon-upd',
                        text: 'Add Input Form' // 入力フォーム追加
                    }, {
                        itemId: 'tpl_transit_aprv_menu',
                        iconCls: 'icon-upd',
                        text: 'Send this SOP to Supervisor' // 承認可能にする
                    }, {
                        itemId: 'tpl_del_menu',
                        iconCls: 'icon-del',
                        text: 'Delete' // 削除
                    }]
                }
            );
        },

        onDestroy: function() {
            this.menu.destroy();
            this.callParent();
        },

        onItemContextMenu: function(grid, rec, item, idx, e, eopts) {
            this.menu = this.buildMenu();
            e.stopEvent();

            // 承認要求済の場合は、文面をキャンセルに変更する
            if (rec['raw']['aprv_flg'] == 4) {
                this.menu.items.map.tpl_transit_aprv_menu.text = 'Enable Approval Application'; // 承認可能にする
            } else {
                this.menu.items.map.tpl_transit_aprv_menu.text = 'Withdraw Approval Application'; // 承認申請を取り下げる
            }

            //承認済/差戻し ステータスのテンプレートに対して「承認可能にする」は選択できないようにする
            if (rec['raw']['aprv_flg'] == 1 || rec['raw']['aprv_flg'] == 2) {
                this.menu.items.map.tpl_transit_aprv_menu.disabled = true;
                this.menu.items.map.tpl_dtl_edit_menu.disabled = true;
            } else {
                this.menu.items.map.tpl_transit_aprv_menu.disabled = false;
                this.menu.items.map.tpl_dtl_edit_menu.disabled = false;
            }

            //入力フォーム設定中かつsopimageソース以外は、「入力フォームの編集」をできないようにする
            if (rec['raw']['aprv_flg'] == 4 && rec['raw']['schema_type'] == 1) {
                this.menu.items.map.tpl_edit_menu.disabled = false;
            } else {
                this.menu.items.map.tpl_edit_menu.disabled = true;
            }

            this.menu.showAt(e.getXY());
        }
    }
);
