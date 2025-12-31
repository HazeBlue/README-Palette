// ===== README 生成器 =====
const READMEGenerator = {
    // 初始化
    init: function() {
        this.bindEvents();
        this.initTheme();
    },

    // 绑定事件
    bindEvents: function() {
        const self = this;
        
        // 生成按钮
        $('#generateBtn').on('click', function() {
            self.generateREADME();
        });

        // 复制按钮
        $('#copyBtn').on('click', function() {
            self.copyToClipboard();
        });

        // 下载按钮
        $('#downloadBtn').on('click', function() {
            self.downloadREADME();
        });

        // 清空按钮
        $('#clearBtn').on('click', function() {
            self.clearForm();
        });

        // 主题切换
        $('.theme-btn').on('click', function() {
            const theme = $(this).data('theme');
            self.switchTheme(theme);
        });

        // 实时预览（可选，用户输入时自动更新）
        $('input, textarea, select').on('input change', function() {
            if ($('#generateBtn').data('generated')) {
                self.generateREADME();
            }
        });
    },

    // 初始化主题
    initTheme: function() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.switchTheme(savedTheme);
    },

    // 切换主题
    switchTheme: function(theme) {
        $('body').attr('data-theme', theme);
        $('.theme-btn').removeClass('active');
        $(`.theme-btn[data-theme="${theme}"]`).addClass('active');
        localStorage.setItem('theme', theme);
    },

    // 获取表单数据
    getFormData: function() {
        return {
            projectName: $('#projectName').val().trim(),
            projectDesc: $('#projectDesc').val().trim(),
            features: $('#features').val().trim(),
            techStack: $('#techStack').val().trim(),
            install: $('#install').val().trim(),
            usage: $('#usage').val().trim(),
            screenshots: $('#screenshots').val().trim(),
            author: $('#author').val().trim(),
            githubUsername: $('#githubUsername').val().trim(),
            repoName: $('#repoName').val().trim(),
            btcAddress: $('#btcAddress').val().trim(),
            ethAddress: $('#ethAddress').val().trim(),
            usdtAddress: $('#usdtAddress').val().trim(),
            license: $('#license').val(),
            style: $('#style').val()
        };
    },

    // 生成徽章
    generateBadges: function(data) {
        const badges = [];
        
        if (data.githubUsername && data.repoName) {
            badges.push(`![GitHub stars](https://img.shields.io/github/stars/${data.githubUsername}/${data.repoName}?style=for-the-badge&logo=github&color=${this.getStyleColor(data.style)})`);
            badges.push(`![GitHub forks](https://img.shields.io/github/forks/${data.githubUsername}/${data.repoName}?style=for-the-badge&logo=github&color=${this.getStyleColor(data.style)})`);
        }
        
        if (data.license && data.license !== 'None') {
            badges.push(`![License](https://img.shields.io/badge/license-${data.license}-blue.svg?style=for-the-badge)`);
        }

        return badges.join(' ');
    },

    // 获取风格颜色
    getStyleColor: function(style) {
        const colors = {
            'clean': 'blue',
            'cool': 'purple',
            'minimal': 'gray',
            'gradient': 'pink'
        };
        return colors[style] || 'blue';
    },

    // 生成目录
    generateTOC: function(sections) {
        let toc = '## 📑 目录\n\n';
        sections.forEach(section => {
            if (section) {
                const anchor = section.toLowerCase()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/\s+/g, '-');
                toc += `- [${section}](#${anchor})\n`;
            }
        });
        toc += '\n';
        return toc;
    },

    // 生成功能列表
    generateFeatures: function(featuresText) {
        if (!featuresText) return '';
        
        const features = featuresText.split('\n').filter(f => f.trim());
        if (features.length === 0) return '';
        
        let md = '## ✨ 功能特性\n\n';
        features.forEach(feature => {
            md += `- ${feature.trim()}\n`;
        });
        md += '\n';
        return md;
    },

    // 生成技术栈
    generateTechStack: function(techStack) {
        if (!techStack) return '';
        
        const techs = techStack.split(',').map(t => t.trim()).filter(t => t);
        if (techs.length === 0) return '';
        
        let md = '## 🛠️ 技术栈\n\n';
        techs.forEach(tech => {
            md += `- \`${tech}\`\n`;
        });
        md += '\n';
        return md;
    },

    // 生成截图
    generateScreenshots: function(screenshotsText) {
        let md = '## 📸 截图\n\n';
        
        if (screenshotsText) {
            const screenshots = screenshotsText.split('\n').filter(s => s.trim());
            screenshots.forEach((desc, index) => {
                md += `### ${desc.trim()}\n\n`;
                md += `![Screenshot ${index + 1}](https://via.placeholder.com/800x400/667eea/ffffff?text=Screenshot+${index + 1})\n\n`;
            });
        } else {
            md += `![Screenshot](https://via.placeholder.com/800x400/667eea/ffffff?text=Project+Screenshot)\n\n`;
        }
        
        return md;
    },

    // 生成打赏区块
    generateDonate: function(data) {
        const addresses = [];
        if (data.btcAddress) addresses.push({ name: 'BTC', address: data.btcAddress });
        if (data.ethAddress) addresses.push({ name: 'ETH', address: data.ethAddress });
        if (data.usdtAddress) addresses.push({ name: 'USDT', address: data.usdtAddress });
        
        if (addresses.length === 0) return '';
        
        let md = '## 💝 打赏支持\n\n';
        md += '如果这个项目对你有帮助，欢迎打赏支持！\n\n';
        
        addresses.forEach(item => {
            md += `### ${item.name}\n\n`;
            md += `\`\`\`\n${item.address}\n\`\`\`\n\n`;
        });
        
        return md;
    },

    // 生成许可证
    generateLicense: function(license) {
        if (!license || license === 'None') return '';
        
        return `## 📄 许可证\n\n本项目采用 [${license}](LICENSE) 许可证。\n\n`;
    },

    // 根据风格生成不同的 README
    generateByStyle: function(data, baseContent) {
        const style = data.style || 'clean';
        
        switch(style) {
            case 'cool':
                return this.generateCoolStyle(baseContent);
            case 'minimal':
                return this.generateMinimalStyle(baseContent);
            case 'gradient':
                return this.generateGradientStyle(baseContent);
            default:
                return baseContent;
        }
    },

    // Cool 风格
    generateCoolStyle: function(content) {
        return content.replace(/^## /gm, '## ⚡ ');
    },

    // Minimal 风格（简化内容）
    generateMinimalStyle: function(content) {
        // 移除一些装饰性元素
        return content.replace(/## 📑 目录\n\n[\s\S]*?\n\n/g, '');
    },

    // Gradient 风格（添加更多装饰）
    generateGradientStyle: function(content) {
        return content.replace(/^## /gm, '## 🎨 ');
    },

    // 生成 README
    generateREADME: function() {
        const data = this.getFormData();
        
        if (!data.projectName) {
            alert('请输入项目名称！');
            return;
        }

        let markdown = '';
        
        // 标题
        markdown += `# ${data.projectName}\n\n`;
        
        // 徽章
        const badges = this.generateBadges(data);
        if (badges) {
            markdown += `${badges}\n\n`;
        }
        
        // 项目简介
        if (data.projectDesc) {
            markdown += `## 📖 项目简介\n\n${data.projectDesc}\n\n`;
        }
        
        // 目录
        const sections = [];
        if (data.features) sections.push('功能特性');
        if (data.techStack) sections.push('技术栈');
        if (data.install) sections.push('安装');
        if (data.usage) sections.push('使用');
        if (data.screenshots || true) sections.push('截图');
        if (data.btcAddress || data.ethAddress || data.usdtAddress) sections.push('打赏支持');
        if (data.license && data.license !== 'None') sections.push('许可证');
        
        if (sections.length > 0) {
            markdown += this.generateTOC(sections);
        }
        
        // 功能特性
        if (data.features) {
            markdown += this.generateFeatures(data.features);
        }
        
        // 技术栈
        if (data.techStack) {
            markdown += this.generateTechStack(data.techStack);
        }
        
        // 安装
        if (data.install) {
            markdown += '## 🚀 安装\n\n';
            markdown += '```bash\n';
            markdown += data.install;
            markdown += '\n```\n\n';
        }
        
        // 使用
        if (data.usage) {
            markdown += '## 💻 使用\n\n';
            markdown += '```\n';
            markdown += data.usage;
            markdown += '\n```\n\n';
        }
        
        // 截图
        markdown += this.generateScreenshots(data.screenshots);
        
        // 打赏
        markdown += this.generateDonate(data);
        
        // 许可证
        markdown += this.generateLicense(data.license);
        
        // 作者
        if (data.author) {
            markdown += '## 👤 作者\n\n';
            if (data.githubUsername) {
                markdown += `**${data.author}** - [@${data.githubUsername}](https://github.com/${data.githubUsername})\n\n`;
            } else {
                markdown += `**${data.author}**\n\n`;
            }
        }
        
        // 根据风格调整
        markdown = this.generateByStyle(data, markdown);
        
        // 更新预览
        $('#preview code').text(markdown);
        $('#generateBtn').data('generated', true);
        this.currentMarkdown = markdown;
    },

    // 复制到剪贴板
    copyToClipboard: async function() {
        if (!this.currentMarkdown) {
            alert('请先生成 README！');
            return;
        }
        
        const btn = $('#copyBtn');
        const originalText = btn.html();
        
        try {
            // 优先使用现代 Clipboard API
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(this.currentMarkdown);
            } else {
                // 降级方案：使用传统方法
                const textarea = $('<textarea>').val(this.currentMarkdown).css({
                    position: 'fixed',
                    left: '-9999px'
                }).appendTo('body');
                textarea[0].select();
                document.execCommand('copy');
                textarea.remove();
            }
            
            // 成功提示
            btn.html('✅ 已复制！');
            setTimeout(() => {
                btn.html(originalText);
            }, 2000);
        } catch (err) {
            alert('复制失败，请手动复制！');
            btn.html(originalText);
        }
    },

    // 下载 README.md
    downloadREADME: function() {
        if (!this.currentMarkdown) {
            alert('请先生成 README！');
            return;
        }
        
        const blob = new Blob([this.currentMarkdown], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = $('<a>').attr({
            href: url,
            download: 'README.md'
        }).appendTo('body');
        a[0].click();
        a.remove();
        URL.revokeObjectURL(url);
    },

    // 清空表单
    clearForm: function() {
        if (!confirm('确定要清空所有表单内容吗？')) {
            return;
        }
        
        // 清空所有输入框和文本域
        $('#projectName, #projectDesc, #features, #techStack, #install, #usage, #screenshots, #author, #githubUsername, #repoName, #btcAddress, #ethAddress, #usdtAddress').val('');
        
        // 重置下拉框到默认值
        $('#license').val('MIT');
        $('#style').val('clean');
        
        // 清空预览区
        $('#preview code').text('请填写左侧表单，然后点击「生成 README」按钮...');
        
        // 清除生成标记
        $('#generateBtn').data('generated', false);
        this.currentMarkdown = '';
        
        // 聚焦到第一个输入框
        $('#projectName').focus();
    }
};

// 页面加载完成后初始化
$(document).ready(function() {
    READMEGenerator.init();
});
