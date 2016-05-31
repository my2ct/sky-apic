/*!
 * jQuery Bootgrid v1.2.0 - 05/02/2015
 * Copyright (c) 2014-2015 Rafael Staib (http://www.jquery-bootgrid.com)
 * Licensed under MIT http://www.opensource.org/licenses/MIT
 */
!function (a, b) {
    "use strict";
    function c(a) {
        function b(b) {
            return c.identifier && b[c.identifier] === a[c.identifier]
        }

        var c = this;
        return this.rows.contains(b) ? !1 : (this.rows.push(a), !0)
    }

    function d(b) {
        var c = this.footer ? this.footer.find(b) : a(), d = this.header ? this.header.find(b) : a();
        return a.merge(c, d)
    }

    function e(b) {
        return b ? a.extend({}, this.cachedParams, {ctx: b}) : this.cachedParams
    }

    function f() {
        var b = {
            current: this.current,
            rowCount: this.rowCount,
            sort: this.sortDictionary,
            searchPhrase: this.searchPhrase
        }, c = this.options.post;
        return c = a.isFunction(c) ? c() : c, this.options.requestHandler(a.extend(!0, b, c))
    }

    function g(b) {
        return "." + a.trim(b).replace(/\s+/gm, ".")
    }

    function h() {
        var b = this.options.url;
        return a.isFunction(b) ? b() : b
    }

    function i() {
        this.element.trigger("initialize" + G), l.call(this), this.selection = this.options.selection && null != this.identifier, n.call(this), p.call(this), B.call(this), z.call(this), q.call(this), m.call(this), this.element.trigger("initialized" + G)
    }

    function j() {
        this.options.highlightRows
    }

    function k(a) {
        return a.visible
    }

    function l() {
        var b = this, c = this.element.find("thead > tr").first(), d = !1;
        c.children().each(function () {
            var c = a(this), e = c.data(), f = {
                id: e.columnId,
                identifier: null == b.identifier && e.identifier || !1,
                converter: b.options.converters[e.converter || e.type] || b.options.converters.string,
                text: c.text(),
                align: e.align || "left",
                headerAlign: e.headerAlign || "left",
                cssClass: e.cssClass || "",
                headerCssClass: e.headerCssClass || "",
                formatter: b.options.formatters[e.formatter] || null,
                order: d || "asc" !== e.order && "desc" !== e.order ? null : e.order,
                searchable: !(e.searchable === !1),
                sortable: !(e.sortable === !1),
                visible: !(e.visible === !1),
                width: a.isNumeric(e.width) ? e.width + "px" : "string" == typeof e.width ? e.width : null
            };
            b.columns.push(f), null != f.order && (b.sortDictionary[f.id] = f.order), f.identifier && (b.identifier = f.id, b.converter = f.converter), b.options.multiSort || null === f.order || (d = !0)
        })
    }

    function m() {
        function c(a) {
            for (var b, c = new RegExp(e.searchPhrase, e.options.caseSensitive ? "g" : "gi"), d = 0; d < e.columns.length; d++)if (b = e.columns[d], b.searchable && b.visible && b.converter.to(a[b.id]).search(c) > -1)return !0;
            return !1
        }

        function d(a, b) {
            e.currentRows = a, o.call(e, b), e.options.keepSelection || (e.selectedRows = []), x.call(e, a), s.call(e), u.call(e), e.element._bgBusyAria(!1).trigger("loaded" + G)
        }

        var e = this;
        if (this.element._bgBusyAria(!0).trigger("load" + G), E.call(this), this.options.ajax) {
            var g = f.call(this), i = h.call(this);
            if (null == i || "string" != typeof i || 0 === i.length)throw new Error("Url setting must be a none empty string or a function that returns one.");
            this.xqr && this.xqr.abort();
            var j = {
                url: i, data: g, success: function (b) {
                    e.xqr = null, "string" == typeof b && (b = a.parseJSON(b)), b = e.options.responseHandler(b), e.current = b.current, d(b.rows, b.total)
                }, error: function (a, b) {
                    e.xqr = null, "abort" !== b && (t.call(e), e.element._bgBusyAria(!1).trigger("loaded" + G))
                }
            };
            j = a.extend(this.options.ajaxSettings, j), this.xqr = a.ajax(j)
        } else {
            var k = this.searchPhrase.length > 0 ? this.rows.where(c) : this.rows, l = k.length;
            -1 !== this.rowCount && (k = k.page(this.current, this.rowCount)), b.setTimeout(function () {
                d(k, l)
            }, 10)
        }
    }

    function n() {
        if (!this.options.ajax) {
            var b = this, d = this.element.find("tbody > tr");
            d.each(function () {
                var d = a(this), e = d.children("td"), f = {};
                a.each(b.columns, function (a, b) {
                    f[b.id] = b.converter.from(e.eq(a).text())
                }), c.call(b, f)
            }), o.call(this, this.rows.length), F.call(this)
        }
    }

    function o(a) {
        this.total = a, this.totalPages = -1 === this.rowCount ? 1 : Math.ceil(this.total / this.rowCount)
    }

    function p() {
        var b = this.options.templates, c = this.element.parent().hasClass(this.options.css.responsiveTable) ? this.element.parent() : this.element;
        this.element.addClass(this.options.css.table), 0 === this.element.children("tbody").length && this.element.append(b.body), 1 & this.options.navigation && (this.header = a(b.header.resolve(e.call(this, {id: this.element._bgId() + "-header"}))), c.before(this.header)), 2 & this.options.navigation && (this.footer = a(b.footer.resolve(e.call(this, {id: this.element._bgId() + "-footer"}))), c.after(this.footer))
    }

    function q() {
        if (0 !== this.options.navigation) {
            var b = this.options.css, c = g(b.actions), f = d.call(this, c);
            if (f.length > 0) {
                var h = this, i = this.options.templates, j = a(i.actions.resolve(e.call(this)));
                if (this.options.ajax) {
                    var k = i.icon.resolve(e.call(this, {iconCss: b.iconRefresh})), l = a(i.actionButton.resolve(e.call(this, {
                        content: k,
                        text: this.options.labels.refresh
                    }))).on("click" + G, function (a) {
                        a.stopPropagation(), h.current = 1, m.call(h)
                    });
                    j.append(l)
                }
                w.call(this, j), r.call(this, j), D.call(this, f, j)
            }
        }
    }

    function r(b) {
        if (this.options.columnSelection && this.columns.length > 1) {
            var c = this, d = this.options.css, f = this.options.templates, h = f.icon.resolve(e.call(this, {iconCss: d.iconColumns})), i = a(f.actionDropDown.resolve(e.call(this, {content: h}))), j = g(d.dropDownItem), l = g(d.dropDownItemCheckbox), n = g(d.dropDownMenuItems);
            a.each(this.columns, function (b, h) {
                var o = a(f.actionDropDownCheckboxItem.resolve(e.call(c, {
                    name: h.id,
                    label: h.text,
                    checked: h.visible
                }))).on("click" + G, j, function (b) {
                    b.stopPropagation();
                    var d = a(this), e = d.find(l);
                    if (!e.prop("disabled")) {
                        h.visible = e.prop("checked");
                        var f = c.columns.where(k).length > 1;
                        d.parents(n).find(j + ":has(" + l + ":checked)")._bgEnableAria(f).find(l)._bgEnableField(f), c.element.find("tbody").empty(), B.call(c), m.call(c)
                    }
                });
                i.find(g(d.dropDownMenuItems)).append(o)
            }), b.append(i)
        }
    }

    function s() {
        if (0 !== this.options.navigation) {
            var b = g(this.options.css.infos), c = d.call(this, b);
            if (c.length > 0) {
                var f = this.current * this.rowCount, h = a(this.options.templates.infos.resolve(e.call(this, {
                    end: 0 === this.total || -1 === f || f > this.total ? this.total : f,
                    start: 0 === this.total ? 0 : f - this.rowCount + 1,
                    total: this.total
                })));
                D.call(this, c, h)
            }
        }
    }

    function t() {
        var a = this.element.children("tbody").first(), b = this.options.templates, c = this.columns.where(k).length;
        this.selection && (c += 1), a.html(b.noResults.resolve(e.call(this, {columns: c})))
    }

    function u() {
        if (0 !== this.options.navigation) {
            var b = g(this.options.css.pagination), c = d.call(this, b)._bgShowAria(-1 !== this.rowCount);
            if (-1 !== this.rowCount && c.length > 0) {
                var f = this.options.templates, h = this.current, i = this.totalPages, j = a(f.pagination.resolve(e.call(this))), k = i - h, l = -1 * (this.options.padding - h), m = k >= this.options.padding ? Math.max(l, 1) : Math.max(l - this.options.padding + k, 1), n = 2 * this.options.padding + 1, o = i >= n ? n : i;
                v.call(this, j, "first", "&laquo;", "first")._bgEnableAria(h > 1), v.call(this, j, "prev", "&lt;", "prev")._bgEnableAria(h > 1);
                for (var p = 0; o > p; p++) {
                    var q = p + m;
                    v.call(this, j, q, q, "page-" + q)._bgEnableAria()._bgSelectAria(q === h)
                }
                0 === o && v.call(this, j, 1, 1, "page-1")._bgEnableAria(!1)._bgSelectAria(), v.call(this, j, "next", "&gt;", "next")._bgEnableAria(i > h), v.call(this, j, "last", "&raquo;", "last")._bgEnableAria(i > h), D.call(this, c, j)
            }
        }
    }

    function v(b, c, d, f) {
        var h = this, i = this.options.templates, j = this.options.css, k = e.call(this, {
            css: f,
            text: d,
            uri: "#" + c
        }), l = a(i.paginationItem.resolve(k)).on("click" + G, g(j.paginationButton), function (b) {
            b.stopPropagation();
            var c = a(this), d = c.parent();
            if (!d.hasClass("active") && !d.hasClass("disabled")) {
                var e = {
                    first: 1,
                    prev: h.current - 1,
                    next: h.current + 1,
                    last: h.totalPages
                }, f = c.attr("href").substr(1);
                h.current = e[f] || +f, m.call(h)
            }
            c.trigger("blur")
        });
        return b.append(l), l
    }

    function w(b) {
        function c(a) {
            return -1 === a ? d.options.labels.all : a
        }

        var d = this, f = this.options.rowCount;
        if (a.isArray(f)) {
            var h = this.options.css, i = this.options.templates, j = a(i.actionDropDown.resolve(e.call(this, {content: c(this.rowCount)}))), k = g(h.dropDownMenu), l = g(h.dropDownMenuText), n = g(h.dropDownMenuItems), o = g(h.dropDownItemButton);
            a.each(f, function (b, f) {
                var g = a(i.actionDropDownItem.resolve(e.call(d, {
                    text: c(f),
                    uri: "#" + f
                })))._bgSelectAria(f === d.rowCount).on("click" + G, o, function (b) {
                    b.preventDefault();
                    var e = a(this), f = +e.attr("href").substr(1);
                    f !== d.rowCount && (d.current = 1, d.rowCount = f, e.parents(n).children().each(function () {
                        var b = a(this), c = +b.find(o).attr("href").substr(1);
                        b._bgSelectAria(c === f)
                    }), e.parents(k).find(l).text(c(f)), m.call(d))
                });
                j.find(n).append(g)
            }), b.append(j)
        }
    }

    function x(b) {
        if (b.length > 0) {
            var c = this, d = this.options.css, f = this.options.templates, h = this.element.children("tbody").first(), i = !0, j = "";
            a.each(b, function (b, g) {
                var h = "", k = ' data-row-id="' + (null == c.identifier ? b : g[c.identifier]) + '"', l = "";
                if (c.selection) {
                    var m = -1 !== a.inArray(g[c.identifier], c.selectedRows), n = f.select.resolve(e.call(c, {
                        type: "checkbox",
                        value: g[c.identifier],
                        checked: m
                    }));
                    h += f.cell.resolve(e.call(c, {
                        content: n,
                        css: d.selectCell
                    })), i = i && m, m && (l += d.selected, k += ' aria-selected="true"')
                }
                var o = null != g.status && c.options.statusMapping[g.status];
                o && (l += o), a.each(c.columns, function (b, i) {
                    if (i.visible) {
                        var j = a.isFunction(i.formatter) ? i.formatter.call(c, i, g) : i.converter.to(g[i.id]), k = i.cssClass.length > 0 ? " " + i.cssClass : "";
                        h += f.cell.resolve(e.call(c, {
                            content: null == j || "" === j ? "&nbsp;" : j,
                            css: ("right" === i.align ? d.right : "center" === i.align ? d.center : d.left) + k,
                            style: null == i.width ? "" : "width:" + i.width + ";"
                        }))
                    }
                }), l.length > 0 && (k += ' class="' + l + '"'), j += f.row.resolve(e.call(c, {attr: k, cells: h}))
            }), c.element.find("thead " + g(c.options.css.selectBox)).prop("checked", i), h.html(j), y.call(this, h)
        } else t.call(this)
    }

    function y(b) {
        var c = this, d = g(this.options.css.selectBox);
        this.selection && b.off("click" + G, d).on("click" + G, d, function (b) {
            b.stopPropagation();
            var d = a(this), e = c.converter.from(d.val());
            d.prop("checked") ? c.select([e]) : c.deselect([e])
        }), b.off("click" + G, "> tr").on("click" + G, "> tr", function (b) {
            b.stopPropagation();
            var d = a(this), e = null == c.identifier ? d.data("row-id") : c.converter.from(d.data("row-id") + ""), f = null == c.identifier ? c.currentRows[e] : c.currentRows.first(function (a) {
                return a[c.identifier] === e
            });
            c.selection && c.options.rowSelect && (d.hasClass(c.options.css.selected) ? c.deselect([e]) : c.select([e])), c.element.trigger("click" + G, [c.columns, f])
        })
    }

    function z() {
        if (0 !== this.options.navigation) {
            var c = this.options.css, f = g(c.search), h = d.call(this, f);
            if (h.length > 0) {
                var i = this, j = this.options.templates, k = null, l = "", m = g(c.searchField), n = a(j.search.resolve(e.call(this))), o = n.is(m) ? n : n.find(m);
                o.on("keyup" + G, function (c) {
                    c.stopPropagation();
                    var d = a(this).val();
                    (l !== d || 13 === c.which && "" !== d) && (l = d, (13 === c.which || 0 === d.length || d.length >= i.options.searchSettings.characters) && (b.clearTimeout(k), k = b.setTimeout(function () {
                        A.call(i, d)
                    }, i.options.searchSettings.delay)))
                }), D.call(this, h, n)
            }
        }
    }

    function A(a) {
        this.searchPhrase !== a && (this.current = 1, this.searchPhrase = a, m.call(this))
    }

    function B() {
        var b = this, c = this.element.find("thead > tr"), d = this.options.css, f = this.options.templates, h = "", i = this.options.sorting;
        if (this.selection) {
            var j = this.options.multiSelect ? f.select.resolve(e.call(b, {type: "checkbox", value: "all"})) : "";
            h += f.rawHeaderCell.resolve(e.call(b, {content: j, css: d.selectCell}))
        }
        if (a.each(this.columns, function (a, c) {
                if (c.visible) {
                    var g = b.sortDictionary[c.id], j = i && g && "asc" === g ? d.iconUp : i && g && "desc" === g ? d.iconDown : "", k = f.icon.resolve(e.call(b, {iconCss: j})), l = c.headerAlign, m = c.headerCssClass.length > 0 ? " " + c.headerCssClass : "";
                    h += f.headerCell.resolve(e.call(b, {
                        column: c,
                        icon: k,
                        sortable: i && c.sortable && d.sortable || "",
                        css: ("right" === l ? d.right : "center" === l ? d.center : d.left) + m,
                        style: null == c.width ? "" : "width:" + c.width + ";"
                    }))
                }
            }), c.html(h), i) {
            var k = g(d.sortable);
            c.off("click" + G, k).on("click" + G, k, function (c) {
                c.preventDefault(), C.call(b, a(this)), F.call(b), m.call(b)
            })
        }
        if (this.selection && this.options.multiSelect) {
            var l = g(d.selectBox);
            c.off("click" + G, l).on("click" + G, l, function (c) {
                c.stopPropagation(), a(this).prop("checked") ? b.select() : b.deselect()
            })
        }
    }

    function C(a) {
        var b = this.options.css, c = g(b.icon), d = a.data("column-id") || a.parents("th").first().data("column-id"), e = this.sortDictionary[d], f = a.find(c);
        if (this.options.multiSort || (a.parents("tr").first().find(c).removeClass(b.iconDown + " " + b.iconUp), this.sortDictionary = {}), e && "asc" === e)this.sortDictionary[d] = "desc", f.removeClass(b.iconUp).addClass(b.iconDown); else if (e && "desc" === e)if (this.options.multiSort) {
            var h = {};
            for (var i in this.sortDictionary)i !== d && (h[i] = this.sortDictionary[i]);
            this.sortDictionary = h, f.removeClass(b.iconDown)
        } else this.sortDictionary[d] = "asc", f.removeClass(b.iconDown).addClass(b.iconUp); else this.sortDictionary[d] = "asc", f.addClass(b.iconUp)
    }

    function D(b, c) {
        b.each(function (b, d) {
            a(d).before(c.clone(!0)).remove()
        })
    }

    function E() {
        var a = this;
        b.setTimeout(function () {
            if ("true" === a.element._bgAria("busy")) {
                var b = a.options.templates, c = a.element.children("thead").first(), d = a.element.children("tbody").first(), f = d.find("tr > td").first(), g = a.element.height() - c.height() - (f.height() + 20), h = a.columns.where(k).length;
                a.selection && (h += 1), d.html(b.loading.resolve(e.call(a, {columns: h}))), -1 !== a.rowCount && g > 0 && d.find("tr > td").css("padding", "20px 0 " + g + "px")
            }
        }, 250)
    }

    function F() {
        function a(c, d, e) {
            function f(a) {
                return "asc" === h.order ? a : -1 * a
            }

            e = e || 0;
            var g = e + 1, h = b[e];
            return c[h.id] > d[h.id] ? f(1) : c[h.id] < d[h.id] ? f(-1) : b.length > g ? a(c, d, g) : 0
        }

        var b = [];
        if (!this.options.ajax) {
            for (var c in this.sortDictionary)(this.options.multiSort || 0 === b.length) && b.push({
                id: c,
                order: this.sortDictionary[c]
            });
            b.length > 0 && this.rows.sort(a)
        }
    }

    var G = ".rs.jquery.bootgrid", H = function (b, c) {
        this.element = a(b), this.origin = this.element.clone(), this.options = a.extend(!0, {}, H.defaults, this.element.data(), c);
        var d = this.options.rowCount = this.element.data().rowCount || c.rowCount || this.options.rowCount;
        this.columns = [], this.current = 1, this.currentRows = [], this.identifier = null, this.selection = !1, this.converter = null, this.rowCount = a.isArray(d) ? d[0] : d, this.rows = [], this.searchPhrase = "", this.selectedRows = [], this.sortDictionary = {}, this.total = 0, this.totalPages = 0, this.cachedParams = {
            lbl: this.options.labels,
            css: this.options.css,
            ctx: {}
        }, this.header = null, this.footer = null, this.xqr = null
    };
    if (H.defaults = {
            navigation: 3,
            padding: 2,
            columnSelection: !0,
            rowCount: [10, 25, 50, -1],
            selection: !1,
            multiSelect: !1,
            rowSelect: !1,
            keepSelection: !1,
            highlightRows: !1,
            sorting: !0,
            multiSort: !1,
            searchSettings: {delay: 250, characters: 1},
            ajax: !1,
            ajaxSettings: {method: "POST"},
            post: {},
            url: "",
            caseSensitive: !0,
            requestHandler: function (a) {
                return a
            },
            responseHandler: function (a) {
                return a
            },
            converters: {
                numeric: {
                    from: function (a) {
                        return +a
                    }, to: function (a) {
                        return a + ""
                    }
                }, string: {
                    from: function (a) {
                        return a
                    }, to: function (a) {
                        return a
                    }
                }
            },
            css: {
                actions: "actions btn-group",
                center: "text-center",
                columnHeaderAnchor: "column-header-anchor",
                columnHeaderText: "text",
                dropDownItem: "dropdown-item",
                dropDownItemButton: "dropdown-item-button",
                dropDownItemCheckbox: "dropdown-item-checkbox",
                dropDownMenu: "dropdown btn-group",
                dropDownMenuItems: "dropdown-menu pull-right",
                dropDownMenuText: "dropdown-text",
                footer: "bootgrid-footer container-fluid",
                header: "bootgrid-header container-fluid",
                icon: "icon glyphicon",
                iconColumns: "glyphicon-th-list",
                iconDown: "glyphicon-chevron-down",
                iconRefresh: "glyphicon-refresh",
                iconSearch: "glyphicon-search",
                iconUp: "glyphicon-chevron-up",
                infos: "infos",
                left: "text-left",
                pagination: "pagination",
                paginationButton: "button",
                responsiveTable: "table-responsive",
                right: "text-right",
                search: "search form-group",
                searchField: "search-field form-control",
                selectBox: "select-box",
                selectCell: "select-cell",
                selected: "active",
                sortable: "sortable",
                table: "bootgrid-table table"
            },
            formatters: {},
            labels: {
                all: "All",
                infos: "Showing {{ctx.start}} to {{ctx.end}} of {{ctx.total}} entries",
                loading: "Loading...",
                noResults: "No results found!",
                refresh: "Refresh",
                search: "Search"
            },
            statusMapping: {0: "success", 1: "info", 2: "warning", 3: "danger"},
            templates: {
                actionButton: '<button class="btn btn-default" type="button" title="{{ctx.text}}">{{ctx.content}}</button>',
                actionDropDown: '<div class="{{css.dropDownMenu}}"><button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown"><span class="{{css.dropDownMenuText}}">{{ctx.content}}</span> <span class="caret"></span></button><ul class="{{css.dropDownMenuItems}}" role="menu"></ul></div>',
                actionDropDownItem: '<li><a href="{{ctx.uri}}" class="{{css.dropDownItem}} {{css.dropDownItemButton}}">{{ctx.text}}</a></li>',
                actionDropDownCheckboxItem: '<li><label class="{{css.dropDownItem}}"><input name="{{ctx.name}}" type="checkbox" value="1" class="{{css.dropDownItemCheckbox}}" {{ctx.checked}} /> {{ctx.label}}</label></li>',
                actions: '<div class="{{css.actions}}"></div>',
                body: "<tbody></tbody>",
                cell: '<td class="{{ctx.css}}" style="{{ctx.style}}">{{ctx.content}}</td>',
                footer: '<div id="{{ctx.id}}" class="{{css.footer}}"><div class="row"><div class="col-sm-6"><p class="{{css.pagination}}"></p></div><div class="col-sm-6 infoBar"><p class="{{css.infos}}"></p></div></div></div>',
                header: '<div id="{{ctx.id}}" class="{{css.header}}"><div class="row"><div class="col-sm-12 actionBar"><p class="{{css.search}}"></p><p class="{{css.actions}}"></p></div></div></div>',
                headerCell: '<th data-column-id="{{ctx.column.id}}" class="{{ctx.css}}" style="{{ctx.style}}"><a href="javascript:void(0);" class="{{css.columnHeaderAnchor}} {{ctx.sortable}}"><span class="{{css.columnHeaderText}}">{{ctx.column.text}}</span>{{ctx.icon}}</a></th>',
                icon: '<span class="{{css.icon}} {{ctx.iconCss}}"></span>',
                infos: '<div class="{{css.infos}}">{{lbl.infos}}</div>',
                loading: '<tr><td colspan="{{ctx.columns}}" class="loading">{{lbl.loading}}</td></tr>',
                noResults: '<tr><td colspan="{{ctx.columns}}" class="no-results">{{lbl.noResults}}</td></tr>',
                pagination: '<ul class="{{css.pagination}}"></ul>',
                paginationItem: '<li class="{{ctx.css}}"><a href="{{ctx.uri}}" class="{{css.paginationButton}}">{{ctx.text}}</a></li>',
                rawHeaderCell: '<th class="{{ctx.css}}">{{ctx.content}}</th>',
                row: "<tr{{ctx.attr}}>{{ctx.cells}}</tr>",
                search: '<div class="{{css.search}}"><div class="input-group"><span class="{{css.icon}} input-group-addon {{css.iconSearch}}"></span> <input type="text" class="{{css.searchField}}" placeholder="{{lbl.search}}" /></div></div>',
                select: '<input name="select" type="{{ctx.type}}" class="{{css.selectBox}}" value="{{ctx.value}}" {{ctx.checked}} />'
            }
        }, H.prototype.append = function (a) {
            if (this.options.ajax); else {
                for (var b = [], d = 0; d < a.length; d++)c.call(this, a[d]) && b.push(a[d]);
                F.call(this), j.call(this, b), m.call(this), this.element.trigger("appended" + G, [b])
            }
            return this
        }, H.prototype.clear = function () {
            if (this.options.ajax); else {
                var b = a.extend([], this.rows);
                this.rows = [], this.current = 1, this.total = 0, m.call(this), this.element.trigger("cleared" + G, [b])
            }
            return this
        }, H.prototype.destroy = function () {
            return a(b).off(G), 1 & this.options.navigation && this.header.remove(), 2 & this.options.navigation && this.footer.remove(), this.element.before(this.origin).remove(), this
        }, H.prototype.reload = function () {
            return this.current = 1, m.call(this), this
        }, H.prototype.remove = function (a) {
            if (null != this.identifier) {
                if (this.options.ajax); else {
                    a = a || this.selectedRows;
                    for (var b, c = [], d = 0; d < a.length; d++) {
                        b = a[d];
                        for (var e = 0; e < this.rows.length; e++)if (this.rows[e][this.identifier] === b) {
                            c.push(this.rows[e]), this.rows.splice(e, 1);
                            break
                        }
                    }
                    this.current = 1, m.call(this), this.element.trigger("removed" + G, [c])
                }
            }
            return this
        }, H.prototype.search = function (a) {
            if (a = a || "", this.searchPhrase !== a) {
                var b = g(this.options.css.searchField), c = d.call(this, b);
                c.val(a)
            }
            return A.call(this, a), this
        }, H.prototype.select = function (b) {
            if (this.selection) {
                b = b || this.currentRows.propValues(this.identifier);
                for (var c, d, e = []; b.length > 0 && (this.options.multiSelect || 1 !== e.length);)if (c = b.pop(), -1 === a.inArray(c, this.selectedRows))for (d = 0; d < this.currentRows.length; d++)if (this.currentRows[d][this.identifier] === c) {
                    e.push(this.currentRows[d]), this.selectedRows.push(c);
                    break
                }
                if (e.length > 0) {
                    var f = g(this.options.css.selectBox), h = this.selectedRows.length >= this.currentRows.length;
                    for (d = 0; !this.options.keepSelection && h && d < this.currentRows.length;)h = -1 !== a.inArray(this.currentRows[d++][this.identifier], this.selectedRows);
                    for (this.element.find("thead " + f).prop("checked", h), this.options.multiSelect || this.element.find("tbody > tr " + f + ":checked").trigger("click" + G), d = 0; d < this.selectedRows.length; d++)this.element.find('tbody > tr[data-row-id="' + this.selectedRows[d] + '"]').addClass(this.options.css.selected)._bgAria("selected", "true").find(f).prop("checked", !0);
                    this.element.trigger("selected" + G, [e])
                }
            }
            return this
        }, H.prototype.deselect = function (b) {
            if (this.selection) {
                b = b || this.currentRows.propValues(this.identifier);
                for (var c, d, e, f = []; b.length > 0;)if (c = b.pop(), e = a.inArray(c, this.selectedRows), -1 !== e)for (d = 0; d < this.currentRows.length; d++)if (this.currentRows[d][this.identifier] === c) {
                    f.push(this.currentRows[d]), this.selectedRows.splice(e, 1);
                    break
                }
                if (f.length > 0) {
                    var h = g(this.options.css.selectBox);
                    for (this.element.find("thead " + h).prop("checked", !1), d = 0; d < f.length; d++)this.element.find('tbody > tr[data-row-id="' + f[d][this.identifier] + '"]').removeClass(this.options.css.selected)._bgAria("selected", "false").find(h).prop("checked", !1);
                    this.element.trigger("deselected" + G, [f])
                }
            }
            return this
        }, H.prototype.sort = function (b) {
            var c = b ? a.extend({}, b) : {};
            return c === this.sortDictionary ? this : (this.sortDictionary = c, B.call(this), F.call(this), m.call(this), this)
        }, H.prototype.getColumnSettings = function () {
            return a.merge([], this.columns)
        }, H.prototype.getCurrentPage = function () {
            return this.current
        }, H.prototype.getCurrentRows = function () {
            return a.merge([], this.currentRows)
        }, H.prototype.getRowCount = function () {
            return this.rowCount
        }, H.prototype.getSearchPhrase = function () {
            return this.searchPhrase
        }, H.prototype.getSelectedRows = function () {
            return a.merge([], this.selectedRows)
        }, H.prototype.getSortDictionary = function () {
            return a.extend({}, this.sortDictionary)
        }, H.prototype.getTotalPageCount = function () {
            return this.totalPages
        }, H.prototype.getTotalRowCount = function () {
            return this.total
        }, a.fn.extend({
            _bgAria: function (a, b) {
                return b ? this.attr("aria-" + a, b) : this.attr("aria-" + a)
            }, _bgBusyAria: function (a) {
                return null == a || a ? this._bgAria("busy", "true") : this._bgAria("busy", "false")
            }, _bgRemoveAria: function (a) {
                return this.removeAttr("aria-" + a)
            }, _bgEnableAria: function (a) {
                return null == a || a ? this.removeClass("disabled")._bgAria("disabled", "false") : this.addClass("disabled")._bgAria("disabled", "true")
            }, _bgEnableField: function (a) {
                return null == a || a ? this.removeAttr("disabled") : this.attr("disabled", "disable")
            }, _bgShowAria: function (a) {
                return null == a || a ? this.show()._bgAria("hidden", "false") : this.hide()._bgAria("hidden", "true")
            }, _bgSelectAria: function (a) {
                return null == a || a ? this.addClass("active")._bgAria("selected", "true") : this.removeClass("active")._bgAria("selected", "false")
            }, _bgId: function (a) {
                return a ? this.attr("id", a) : this.attr("id")
            }
        }), !String.prototype.resolve) {
        var I = {
            checked: function (a) {
                return "boolean" == typeof a ? a ? 'checked="checked"' : "" : a
            }
        };
        String.prototype.resolve = function (b, c) {
            var d = this;
            return a.each(b, function (b, e) {
                if (null != e && "function" != typeof e)if ("object" == typeof e) {
                    var f = c ? a.extend([], c) : [];
                    f.push(b), d = d.resolve(e, f) + ""
                } else {
                    I && I[b] && "function" == typeof I[b] && (e = I[b](e)), b = c ? c.join(".") + "." + b : b;
                    var g = new RegExp("\\{\\{" + b + "\\}\\}", "gm");
                    d = d.replace(g, e.replace ? e.replace(/\$/gi, "&#36;") : e)
                }
            }), d
        }
    }
    Array.prototype.first || (Array.prototype.first = function (a) {
        for (var b = 0; b < this.length; b++) {
            var c = this[b];
            if (a(c))return c
        }
        return null
    }), Array.prototype.contains || (Array.prototype.contains = function (a) {
        for (var b = 0; b < this.length; b++) {
            var c = this[b];
            if (a(c))return !0
        }
        return !1
    }), Array.prototype.page || (Array.prototype.page = function (a, b) {
        var c = (a - 1) * b, d = c + b;
        return this.length > c ? this.length > d ? this.slice(c, d) : this.slice(c) : []
    }), Array.prototype.where || (Array.prototype.where = function (a) {
        for (var b = [], c = 0; c < this.length; c++) {
            var d = this[c];
            a(d) && b.push(d)
        }
        return b
    }), Array.prototype.propValues || (Array.prototype.propValues = function (a) {
        for (var b = [], c = 0; c < this.length; c++)b.push(this[c][a]);
        return b
    });
    var J = a.fn.bootgrid;
    a.fn.bootgrid = function (b) {
        var c = Array.prototype.slice.call(arguments, 1), d = null, e = this.each(function (e) {
            var f = a(this), g = f.data(G), h = "object" == typeof b && b;
            if ((g || "destroy" !== b) && (g || (f.data(G, g = new H(this, h)), i.call(g)), "string" == typeof b))if (0 === b.indexOf("get") && 0 === e)d = g[b].apply(g, c); else if (0 !== b.indexOf("get"))return g[b].apply(g, c)
        });
        return "string" == typeof b && 0 === b.indexOf("get") ? d : e
    }, a.fn.bootgrid.Constructor = H, a.fn.bootgrid.noConflict = function () {
        return a.fn.bootgrid = J, this
    }, a('[data-toggle="bootgrid"]').bootgrid()
}(jQuery, window);