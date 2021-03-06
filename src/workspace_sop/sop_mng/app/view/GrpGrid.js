Ext.define(
    "sop_mng.view.GrpGrid", {
        extend: 'Ext.grid.Panel',
        xtype: 'grp-grid',

        store: 'GrpStore',
        selModel: {
            selType: 'rowmodel'
        },

        columns: [{
            xtype: 'rownumberer'
        }, {
            dataIndex: 'grp_id',
            text: 'grp_id',
            hidden: true
        }, {
            dataIndex: 'grp_name',
            text: 'Group Name', // グループ名
            width: 300
        }],

        features: [{
            ftype: 'filters',
            filters: [{
                type: 'string',
                dataIndex: 'grp_name'
            }]
        }],

        bbar: [{
            xtype: 'pagingtoolbar',
            store: 'GrpStore',
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
                    itemId: 'grp_grid_menu',
                    items: [{
                        itemId: 'grp_add_menu',
                        iconCls: 'icon-add',
                        text: 'Add' // 追加
                    }, {
                        itemId: 'grp_upd_menu',
                        iconCls: 'icon-upd',
                        text: 'Edit' // 編集
                    }, {
                        itemId: 'grp_del_menu',
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
            e.stopEvent();
            this.menu.showAt(e.getXY());
        }
    }
);
