import Portfolio from '../Models/Portfolio.mjs';

// Upload new project
export const createPortfolio = async (req, res) => {
  try {
    const { designer_id, project_title, description, image_url, category } = req.body;

    const portfolio = new Portfolio({
      designer_id,
      project_title,
      description,
      image_url,
      category
    });

    await portfolio.save();
    res.status(201).json({ success: true, portfolio });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get portfolio by designer
export const getPortfolioByDesigner = async (req, res) => {
  try {
    const { designerId } = req.params;
    const portfolio = await Portfolio.find({ designer_id: designerId }).sort({ createdAt: -1 });
    
    res.json({ success: true, portfolio });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete portfolio item
export const deletePortfolio = async (req, res) => {
  try {
    const { id } = req.params;
    const portfolio = await Portfolio.findByIdAndDelete(id);
    
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }

    res.json({ success: true, message: 'Portfolio item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};