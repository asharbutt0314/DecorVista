import Blog from '../Models/Blog.mjs';

// Get all blogs
export const getBlogs = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      search,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const filter = {};
    
    // If status is specified, filter by it, otherwise show all for admin
    if (status) {
      filter.status = status;
    } else if (!req.admin) {
      // For public access, only show published
      filter.status = 'published';
    }
    
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const blogs = await Blog.find(filter)
      .populate('author', 'username profile')
      .select('-content') // Exclude full content for list view
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Blog.countDocuments(filter);

    res.json({
      success: true,
      blogs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single blog
export const getBlog = async (req, res) => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOne({ slug, status: 'published' })
      .populate('author', 'username profile');

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Increment views
    blog.views += 1;
    await blog.save();

    res.json({ success: true, blog });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create blog (Admin only)
export const createBlog = async (req, res) => {
  try {
    const { title, content, excerpt, featuredImage, category, tags, status, seo } = req.body;
    const author = req.admin.id;

    // Calculate read time (average 200 words per minute)
    const wordCount = content.split(' ').length;
    const readTime = Math.ceil(wordCount / 200);

    const blog = new Blog({
      title,
      content,
      excerpt,
      featuredImage,
      author,
      authorModel: 'Admin',
      category,
      tags,
      status,
      readTime,
      seo,
      publishedAt: status === 'published' ? new Date() : null
    });

    await blog.save();

    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      blog
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update blog (Admin only)
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Recalculate read time if content is updated
    if (updateData.content) {
      const wordCount = updateData.content.split(' ').length;
      updateData.readTime = Math.ceil(wordCount / 200);
    }

    // Set published date if status changes to published
    if (updateData.status === 'published' && !updateData.publishedAt) {
      updateData.publishedAt = new Date();
    }

    const blog = await Blog.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json({
      success: true,
      message: 'Blog updated successfully',
      blog
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete blog (Admin only)
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get blogs by category
export const getBlogsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const blogs = await Blog.find({ category, status: 'published' })
      .populate('author', 'username profile')
      .select('-content')
      .sort({ publishedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Blog.countDocuments({ category, status: 'published' });

    res.json({
      success: true,
      blogs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get featured blogs
export const getFeaturedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ status: 'published' })
      .populate('author', 'username profile')
      .select('-content')
      .sort({ views: -1, publishedAt: -1 })
      .limit(5);

    res.json({ success: true, blogs });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};